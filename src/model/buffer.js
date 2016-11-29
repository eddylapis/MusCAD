import BufferContext from '../graphics/rendering-context/buffer-context';
import earcut from 'earcut';
import { vec3, mat4 } from 'geom3';
import _ from 'lodash';

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

function _genFaceIndices(idxTable, face) {
  let arrOuterLoop  = face.outerLoop,
    arrInnerLoops = face.innerLoops; // loop: [v1,v2...]

  let loops = [
    ...arrOuterLoop,
    ...arrInnerLoops.reduce((m,e) => m.concat(e), []),
  ];

  let {indices: vLoopIndex} = _earcutFix(
    loops.map(v => v.position),
    _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops)
  );

  let localIndices = vLoopIndex.map(i => loops[i]).map(v => idxTable[v.id]);

  return localIndices;

  function _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops) {
    let indices = arrInnerLoops.map(l => l.length);
    let startLen = arrOuterLoop.length;
    indices.unshift(0)
    indices = indices.map(i => i + startLen);
    indices.pop()
    return indices;
  }

  function _earcutFix(arrOri, holeInd){
    let v1 = vec3.create();
    let v2 = vec3.create();
    vec3.sub(v1, arrOri[1], arrOri[0]);
    vec3.sub(v2, arrOri[2], arrOri[1]);

    let newZ = vec3.create();
    let newY = vec3.create();
    let newX = vec3.create();
    vec3.cross(newZ, v1, v2);
    vec3.normalize(newZ, newZ);
    vec3.copy(newX, v1);
    vec3.normalize(newX, newX);
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
      normal: vec3.clone(newZ),
      back_normal: vec3.negate(vec3.create(), newZ),
    };
  }
}

function _genEdgeIndices(idxTable, edge) {
  return [edge.start, edge.end].map(v => idxTable[v.id]);
}

function genBuffers(definition) {
  let localIdxTable = {};
  let vBuffer = _genVertexBuffer(localIdxTable, definition.vertices);

  let allFaceIndices = [];
  for (let key in definition.faces) {
    let face = definition.faces[key];
    let faceIndices = _genFaceIndices(localIdxTable, face);

    allFaceIndices.push(...faceIndices);
  }

  let allEdgeIndices = [];
  for (let key in definition.edges) {
    let edge = definition.edges[key];
    let edgeIndices = _genEdgeIndices(localIdxTable, edge);

    allEdgeIndices.push(...edgeIndices);
  }

  let arrTrans = _.values(definition.references).map(v => v.absTrans);

  return {
    vBuffer: vBuffer,
    faceIdx: new Uint16Array(allFaceIndices),
    edgeIdx: new Uint16Array(allEdgeIndices),
    arrTrans: arrTrans,
  };
}

let _lastModelID = -1;

function addBuffer(bufferObj) {
  // upload all vertices
  BufferContext.withArray('vertexBuffer', (c) => {
    c.appendArray(bufferObj.vBuffer);
  });

  let indexOffset = BufferContext.headIndexDiff('vertexBuffer', bufferObj.vBuffer);
  // shift indices
  let shiftedFaceIdx = bufferObj.faceIdx.map(i => i + indexOffset);
  let shiftedEdgeIdx = bufferObj.edgeIdx.map(i => i + indexOffset);

  // upload face indices
  bufferObj.faceIdxBufName = 'faceIndexBuffer';
  bufferObj.faceOffset = BufferContext.head('faceIndexBuffer');
  bufferObj.faceCount = shiftedFaceIdx.length;
  BufferContext.withElement('faceIndexBuffer', (c) => {
    c.appendElement(shiftedFaceIdx);
  });

  // upload edge indices
  bufferObj.edgeIdxBufName = 'edgeIndexBuffer';
  bufferObj.edgeOffset = BufferContext.head('edgeIndexBuffer');
  bufferObj.edgeCount = shiftedEdgeIdx.length;
  BufferContext.withElement('edgeIndexBuffer', (c) => {
    c.appendElement(shiftedEdgeIdx);
  });

  // upload all transformations
  BufferContext.gl.activeTexture(BufferContext.gl.TEXTURE1);
  BufferContext.bindTex2d('transTexBuffer');

  bufferObj.modelIDs = [];
  bufferObj.arrTrans.forEach((transDataView) => {
    let modelID = ++_lastModelID;

    bufferObj.modelIDs.push(modelID);
    BufferContext.appendTex2df(transDataView);
  });
}

module.exports = {
  genBuffers,
  addBuffer,
}
