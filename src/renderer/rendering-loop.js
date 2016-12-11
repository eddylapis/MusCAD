import {Workspace} from '../initialize';
import BufferContext from '../graphics/rendering-context/buffer-context';
import ProgramContexts from '../graphics/rendering-context/program-contexts';
import { definitionRenderingObjects } from './gen-rendering-def';
import { materialRenderingObjects } from './gen-rendering-mat';
import {
  edgeSelRenderingObj,
  faceSelRenderingObj,
} from './gen-rendering-sel';
import { selectedEdges } from '../workspace/selection';

let gl = Workspace.gl;

function renderProjLine() {
  ProgramContexts.with(Workspace.glProgram, (pc) => {
    pc.uniform1i('hasTexture', false);

    pc.uniform1i('renderingProjLine', true);
    pc.attr3fv('aNormal', [0,0,1]);
    pc.attr4fv('aColor', [0,0,1,1]);

    pc.enableAttrArray('lnDir');
    pc.enableAttrArray('lnPos2');

    BufferContext.bindArray('lnPos1Buffer');
    pc.attrPointer3f('aPosition', 0, 0);

    BufferContext.bindArray('lnPos2Buffer');
    pc.attrPointer3f('lnPos2', 0, 0);

    BufferContext.bindArray('lnDirBuffer');
    pc.attrPointer1f('lnDir', 0, 0);

    BufferContext.bindElement('lnElemBuffer');
    gl.drawElements(gl.TRIANGLE_STRIP, edgeSelRenderingObj.len, gl.UNSIGNED_SHORT, 0);


    pc.uniform1i('renderingProjLine', false);
    pc.disableAttrArray('lnDir');
    pc.disableAttrArray('lnPos2');
  });
}

export default function renderingLoop() {
  // Draw Projected Lines
  if (edgeSelRenderingObj.len) renderProjLine();

  // Rendering selected Faces
  ProgramContexts.with(Workspace.glProgram, (pc) => {
    if (faceSelRenderingObj.len) {
      pc.uniform1i('overwriteZ', true);
      //pc.attr1f('aModelID', 0);
      pc.attr3fv('aNormal', [0,0,1]);
      pc.attr4fv('aColor', [0,0,1,1]);
      pc.uniform1i('hasTexture', false);
      BufferContext.bindArray('selFacesBuffer');
      pc.attrPointer3f('aPosition', 0, 0);

      gl.drawArrays(gl.TRIANGLES, 0, faceSelRenderingObj.len);
      pc.uniform1i('overwriteZ', false);
    }
  });

  ProgramContexts.with(Workspace.glProgram, (pc) => {
    // Use texture 0 for materials
    gl.activeTexture(gl.TEXTURE0);

    // Loop all definitions
    BufferContext.bindArray('vertexBuffer');
    pc.attrPointer3f('aPosition', 0, 0);

    _.values(definitionRenderingObjects).forEach((defObj) => {
      // Loop all references
      defObj.refs.forEach((ref) => {
        pc.attr1f('aModelID', ref.modelID);

        // Render Edges
        pc.attr4fv('aColor', [0,0,0,1]);
        BufferContext.bindElement(defObj.edgeIdxBufName);
        gl.drawElements(gl.LINES, defObj.edgeCount, gl.UNSIGNED_SHORT, defObj.edgeOffset);

        // Render Faces
        defObj.faceObjs.forEach((faceObj) => {
          BufferContext.bindElement(faceObj.faceIdxBufName);

          pc.uniformMat4('matTexUV', faceObj.uvTrans);

          pc.attr3fv('aNormal', faceObj.normal);
          _resolveFaceMaterial(ref, faceObj).setDrawingState(pc);
          gl.drawElements(gl.TRIANGLES, faceObj.faceCount, gl.UNSIGNED_SHORT, faceObj.faceOffset);

          pc.attr3fv('aNormal', faceObj.backNormal);
          _resolveBackFaceMaterial(ref, faceObj).setDrawingState(pc);
          gl.drawElements(gl.TRIANGLES, faceObj.faceCount, gl.UNSIGNED_SHORT, faceObj.backFaceOffset);
        });
      });
    });
  });
}

function _resolveFaceMaterial(ref, faceObj) {
  return materialRenderingObjects[ref.materialID] ||
    materialRenderingObjects[faceObj.materialID] ||
    materialRenderingObjects.defaultFront;
}

function _resolveBackFaceMaterial(ref, faceObj) {
  return materialRenderingObjects[ref.materialID] ||
    materialRenderingObjects[faceObj.backMaterialID] ||
    materialRenderingObjects.defaultBack;
}
