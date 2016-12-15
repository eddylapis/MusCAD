import BufferContext from '../graphics/rendering-context/buffer-context';
import earcut from 'earcut';
import { vec3, mat4 } from 'geom3';
import Geom3 from 'geom3';
import _ from 'lodash';

import mapVertexIndex from '../modeling/helpers/map-vertex-index';
import getDataViewVertices from '../modeling/helpers/get-dataview-vertices';
import getPolyNormal from '../modeling/helpers/get-poly-normal';
import getArbitraryTransAxesAligned from '../modeling/helpers/get-arbitrary-trans-axes-aligned';

import {derivedFaces, updateDerivedFace} from '../modeling/derived/face';

let _lastModelID = 0; // new models start from 1
let definitionRenderingObjects = {};

function genRenderingDefObj(definition) {

  // create rendering object
  definitionRenderingObjects[definition.id] = {};

  let renderingObj = definitionRenderingObjects[definition.id];

  let localIdxTable = mapVertexIndex(definition),
      vBuffer       = getDataViewVertices(definition);

  let allFaceObj = [];
  for (let key in definition.faces) {
    let face = definition.faces[key];
    updateDerivedFace(localIdxTable, face);
    let {
      localIndices: faceIndices,
      uvTrans: uvTrans,
      normal: normal,
      backNormal: backNormal,
    } = derivedFaces[face.id];

    let faceObj = {};
    faceObj.indices = new Uint16Array(faceIndices);
    faceObj.materialID = face.material && face.material.id;
    faceObj.backMaterialID = face.backMaterial && face.backMaterial.id;
    faceObj.uvTrans = uvTrans;
    faceObj.normal = normal;
    faceObj.backNormal = backNormal;

    allFaceObj.push(faceObj);
  }

  let allEdgeIndices = [];
  for (let key in definition.edges) {
    let edge = definition.edges[key];
    let edgeIndices = _genEdgeIndices(localIdxTable, edge);

    allEdgeIndices.push(...edgeIndices);
  }

  let refs = _.values(definition.references).map(ref => {
    return {
      trans: ref.absTrans,
      materialID: ref.material && ref.material.id,
    };
  });

  let newDefRenderingObj = {
    vBuffer: vBuffer,
    faceObjs: allFaceObj,
    edgeIdx: new Uint16Array(allEdgeIndices),
    refs: refs,
  };

  definitionRenderingObjects[definition.id] = newDefRenderingObj;

  return newDefRenderingObj;
}

function uploadRenderingDefObj(bufferObj) {
  // upload all vertices
  BufferContext.withArray('vertexBuffer', (c) => {
    c.appendArray(bufferObj.vBuffer);
  });

  // shift indices
  let indexOffset = BufferContext.headIndexDiff('vertexBuffer', bufferObj.vBuffer);

  // upload face indices
  bufferObj.faceObjs.forEach((faceObj) => {
    let shiftedFaceIdx = faceObj.indices.map(i => i + indexOffset);
    let shiftedFaceIdxReverse = (new shiftedFaceIdx.constructor(shiftedFaceIdx)).reverse();
    faceObj.faceIdxBufName = 'faceIndexBuffer';
    BufferContext.withElement('faceIndexBuffer', (c) => {
      faceObj.faceOffset = c.head('faceIndexBuffer');
      c.appendElement(shiftedFaceIdx);
      faceObj.backFaceOffset = c.head('faceIndexBuffer');
      c.appendElement(shiftedFaceIdxReverse);
    });
    faceObj.faceCount = shiftedFaceIdx.length;
  });

  // upload edge indices
  let shiftedEdgeIdx = bufferObj.edgeIdx.map(i => i + indexOffset);
  bufferObj.edgeIdxBufName = 'edgeIndexBuffer';
  bufferObj.edgeOffset = BufferContext.head('edgeIndexBuffer');
  bufferObj.edgeCount = shiftedEdgeIdx.length;
  BufferContext.withElement('edgeIndexBuffer', (c) => {
    c.appendElement(shiftedEdgeIdx);
  });

  // upload all transformations
  BufferContext.gl.activeTexture(BufferContext.gl.TEXTURE1);
  BufferContext.bindTex2d('transTexBuffer');

  bufferObj.refs.forEach((ref) => {
    ref.modelID = ++_lastModelID;

    BufferContext.appendTex2df(ref.trans);
  });
}

function _genEdgeIndices(idxTable, edge) {
  return [edge.start, edge.end].map(v => idxTable[v.id]);
}

module.exports = {
  definitionRenderingObjects,
  genRenderingDefObj,
  uploadRenderingDefObj,
};
