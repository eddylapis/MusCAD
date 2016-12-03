import {Workspace} from '../initialize';
import BufferContext from '../graphics/rendering-context/buffer-context';
import ProgramContexts from '../graphics/rendering-context/program-contexts';
import { definitionRenderingObjects } from './gen-rendering-def';
import { materialRenderingObjects } from './gen-rendering-mat';

let gl = Workspace.gl;

export default function renderingLoop() {
  ProgramContexts.with(Workspace.glProgram, (pc) => {
    // Use texture 0 for materials
    gl.activeTexture(gl.TEXTURE0);

    // Loop all definitions
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
