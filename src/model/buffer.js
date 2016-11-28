import BufferContext from '../graphics/rendering-context/buffer-context';
import earcut from 'earcut';
import { vec3, mat4 } from 'geom3';

function genFaceBuffers(definition) {
  let localIdxTable = {};
  let vBuffer = new Float32Array(Object.keys(definition.vertices).length * 3);

  let ind = -1;
  for (let key in definition.vertices) {
    let position = definition.vertices[key].position;
    localIdxTable[key] = ++ind;
    vBuffer[ind*3]     = position[0];
    vBuffer[ind*3 + 1] = position[1];
    vBuffer[ind*3 + 2] = position[2];
  }

  let faceBuffers = [];
  for (let key in definition.faces) {
    let face = definition.faces[key];
    let loops = [
      ...face.outerLoop,
      ...face.innerLoops.reduce((m,e) => m.concat(e), []),
    ];
    //let vLoopIndex = earcut(
    //  loops.map(v => v.position).reduce((m,e) => m.concat(...e), []),
    //  _getInnerLoopStartingIdx(face.outerLoop, face.innerLoops),
    //  3
    //);
    let {indices: vLoopIndex} = _earcutFix(
      loops.map(v => v.position),
      _getInnerLoopStartingIdx(face.outerLoop, face.innerLoops)
    );
    let localIndices = new Uint16Array(
      vLoopIndex.map(i => loops[i]).map(v => localIdxTable[v.id])
    );

    faceBuffers.push({
      buf: vBuffer,
      idx: localIndices,
    });
  }

  return faceBuffers;

  function _getInnerLoopStartingIdx(outerLoop, innerLoops=[]) {
    let indices = innerLoops.map(l => l.length);
    let startLen = outerLoop.length;
    indices.unshift(0)
    indices = indices.map(i => i + startLen);
    indices.pop()
    return indices;
  }
}

let _lastModelID = -1;

function addBuffer(bufferObj, arrTrans) {
  arrTrans.forEach(transDataView => {
    let modelID = ++_lastModelID;
    BufferContext.withArray('vertexBuffer', (c) => {
      c.appendArray(bufferObj.buf);
    });

    let modelBuf = new Float32Array(bufferObj.buf.length / 3).map(() => modelID);

    BufferContext.withArray('ModelIDBuffer', (c) => {
      c.appendArray(modelBuf);
    });

    let indexOffset = BufferContext.headIndexDiff('vertexBuffer', bufferObj.buf);
    let shiftedIndices = bufferObj.idx.map(i => i + indexOffset);

    BufferContext.appendElement(shiftedIndices);

    BufferContext.gl.activeTexture(BufferContext.gl.TEXTURE1);
    BufferContext.bindTex2d('transTexBuffer');
    BufferContext.appendTex2df(transDataView);
  });
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

  return {
    planarPts: pts2d.map(pt => vec3.clone(pt)),
    planar: arr2d.map(pt => vec3.clone(pt)),
    indices: earcut(arr2d, holeInd),
    normal: vec3.clone(newZ),
    back_normal: vec3.negate(vec3.create(), newZ),
  };
}

module.exports = {
  genFaceBuffers,
  addBuffer,
}
