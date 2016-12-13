import BufferContext from '../graphics/rendering-context/buffer-context';
import earcut from 'earcut';
import { vec3, mat4 } from 'geom3';
import Geom3 from 'geom3';
import _ from 'lodash';

import mapVertexIndex from '../modeling/helpers/map-vertex-index';
import flattenVertices from '../modeling/helpers/flatten-vertices';

let _lastModelID = 0; // new models start from 1
let definitionRenderingObjects = {};

function genRenderingDefObj(definition) {

  // create rendering object
  definitionRenderingObjects[definition.id] = {};

  let renderingObj = definitionRenderingObjects[definition.id];

  let localIdxTable = mapVertexIndex(definition),
      vBuffer       = flattenVertices(definition);

  let allFaceObj = [];
  for (let key in definition.faces) {
    let face = definition.faces[key];
    let {
      localIndices: faceIndices,
      uvTrans: uvTrans,
      normal: normal,
      backNormal: backNormal,
    } = _genFaceProps(localIdxTable, face);

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

function _genVertexBuffer(idxTable, vertices) {
  let vBuffer = new Float32Array(Object.keys(vertices).length * 3);

  let ind = -1;
  for (let key in vertices) {
    let position = vertices[key].position;
    idxTable[key] = ++ind;
    vBuffer[ind*3]     = position[0];
    vBuffer[ind*3 + 1] = position[1];
    vBuffer[ind*3 + 2] = position[2];
  }

  return vBuffer;
}

function _genFaceProps(idxTable, face) {
  let arrOuterLoop  = face.outerLoop,
    arrInnerLoops = face.innerLoops; // loop: [v1,v2...]

  let loops = [
    ...arrOuterLoop,
    ...arrInnerLoops.reduce((m,e) => m.concat(e), []),
  ];

  let {
    indices: vLoopIndex,
    uvTrans: uvTrans,
    normal: normal,
    backNormal: backNormal,
  } = _earcutFix(
    loops.map(v => v.position),
    _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops)
  );

  let localIndices = vLoopIndex.map(i => loops[i]).map(v => idxTable[v.id]);

  return {localIndices, uvTrans, normal, backNormal};

  function _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops) {
    let indices = arrInnerLoops.map(l => l.length);
    let startLen = arrOuterLoop.length;
    indices.unshift(0)
    indices = indices.map(i => i + startLen);
    indices.pop()
    return indices;
  }

  function _getPolyNormal(arrPoints) {
    let firstVec = Geom3.sub([], arrPoints[1], arrPoints[0]);
    let normal;
    for (let i=1; i<arrPoints.length-1; ++i) {
      normal = Geom3.cross([], firstVec, Geom3.sub([], arrPoints[i+1], arrPoints[i]));
      if (!Geom3.isZeroVec(normal)) break;
    }
    return Geom3.norm(new Float32Array(3), normal);
  }

  function _getUVTrans(z) {
    let x = Geom3.cross(new Float32Array(3), z, Geom3.Z_AXIS);
    if (Geom3.isZeroVec(x)) x = Geom3.vec3.copy(new Float32Array(3), Geom3.X_AXIS);
    let y = Geom3.cross(new Float32Array(3), z, x);

    let m4 = Geom3.mat4.create();

    m4[0]  = x[0];
    m4[1]  = y[0];
    m4[2]  = z[0];
    m4[4]  = x[1];
    m4[5]  = y[1];
    m4[6]  = z[1];
    m4[8]  = x[2];
    m4[9]  = y[2];
    m4[10] = z[2];

    return m4;
  }

  function _earcutFix(arrOri, holeInd){
    let newZ = _getPolyNormal(arrOri);
    let newY = vec3.create();
    let newX = vec3.create();
    vec3.sub(newX, arrOri[1], arrOri[0]);
    vec3.cross(newY, newX, newZ);

    let m4 = mat4.create();
    m4[0]  = newX[0];
    m4[1]  = newY[0];
    m4[2]  = newZ[0];
    m4[4]  = newX[1];
    m4[5]  = newY[1];
    m4[6]  = newZ[1];
    m4[8]  = newX[2];
    m4[9]  = newY[2];
    m4[10] = newZ[2];

    let arr2d = [];
    let pts2d = [];
    arrOri.forEach(function(pt) {
      var vecTmp = vec3.create();
      vec3.transformMat4(vecTmp, pt, m4);
      arr2d.push(vecTmp[0]);
      arr2d.push(vecTmp[1]);
      pts2d.push([vecTmp[0], vecTmp[1]]);
    });

    let indices = [];
    try {
      indices = earcut(arr2d, holeInd);
    } catch(e) {
      console.log(e);
    }

    return {
      planarPts: pts2d.map(pt => vec3.clone(pt)),
      planar: arr2d.map(pt => vec3.clone(pt)),
      indices: indices,
      normal: vec3.copy(new Float32Array(3), newZ),
      backNormal: vec3.negate(new Float32Array(3), newZ),
      uvTrans: _getUVTrans(newZ),
    };
  }
}

function _genEdgeIndices(idxTable, edge) {
  return [edge.start, edge.end].map(v => idxTable[v.id]);
}

module.exports = {
  _genVertexBuffer,
  _genFaceProps,
  definitionRenderingObjects,
  genRenderingDefObj,
  uploadRenderingDefObj,
}
