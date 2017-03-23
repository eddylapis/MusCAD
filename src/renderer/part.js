import Geom3 from 'geom3';

import earcut from 'earcut';

import getPolyNormal from './helpers/get-poly-normal';
import getArbitraryTransAxesAligned from './helpers/get-arbitrary-trans-axes-aligned';

import { ArrayF32, stride, offset } from '../webgl';

function _pushVArray(arr, pt, normal, uv) {
  arr.push(pt[0]);
  arr.push(pt[1]);
  arr.push(pt[2]);
  arr.push(normal[0]);
  arr.push(normal[1]);
  arr.push(normal[2]);
  arr.push(uv[0]);
  arr.push(uv[1]);

  return arr;
}

function _degenerateArray() {
  return _pushVArray([], [0,0,0], [0,0,0], [0,0,0]);
}

export default class Part {
  constructor(transArray, material, faces, side='front') {
    this.material = material;
    this.faces = faces;
    this.isBack = (side === 'front');

    this.transArray = transArray || [];
    this.numIns = transArray.length;

    this.compute();
    this.upload();
  }

  compute() {
    let numPts = 0;
    let vertexArraysPerFace = this.faces.map(f => this.getVertexArray(f));
    let vertexArray = vertexArraysPerFace.reduce((acc, e) => {
      numPts += e.numPts;
      return acc.concat(e);
    }
    , []);

    this.numPts = numPts;
    this.vertexArray = new Float32Array(vertexArray);
  }

  upload() {
    let buffer = new ArrayF32();
    this.buffer = buffer;
    buffer.init();
    buffer.bind();
    buffer.alloc(this.vertexArray.length);
    buffer.uploadSub(0, this.vertexArray);
  }

  render(program) {
    if (!this.numPts) return;
    let gl = program.gl;
    this.material.setRendering(program);

    this.buffer.bind();
    program.updateAttrPointer('a_position', stride('xyzxyzst'), 0);
    program.updateAttrPointer('a_normal', stride('xyzxyzst'), offset('xyz'));
    program.updateAttrPointer('a_uv', stride('xyzxyzst'), offset('xyzxyz'));

    for (let i=0; i<this.numIns; i++) {
      program.updateUniform('mat_ins', this.transArray[i]);
      gl.drawArrays(gl.TRIANGLES, 0, this.numPts);
    }
  }

  getVertexArray(face) {
    let res = _earcutFix(_allPos(face), _getInnerLoopStartingIdx(face.outerLoop, face.innerLoops));
    if (!this.isBack) {
      //TODO: check this
      res._indices.reverse();
      Geom3.vec3.negate(res._normal, res._normal);
    }
    let pts = this._triangulate(res._allPos, res._indices);
    let normals = this._getNormals(pts, res._normal);
    let uvs = this._getUVs(pts, res._trans2D);

    this.res = res;

    let vertexArray = [];

    pts.forEach((pt, i) => {
      let normal = normals[i];
      let uv = uvs[i];
      _pushVArray(vertexArray, pt, normal, uv);
    });

    vertexArray.numPts = pts.length;

    return vertexArray;
  }

  _triangulate(allPos, indices) { return indices.map(i => allPos[i]); }

  _getNormals(pts, normal) { return pts.map(i => normal); }

  _getUVs(pts, trans2D) {
    let texture = this.material.texture;
    trans2D = Geom3.mat4.multiply(trans2D, _getTexScaleTrans(texture), trans2D);
    return pts.map(pt => Geom3.vec3.transformMat4(Geom3.vec3.create(), pt, trans2D));
  }
}

function _getTexScaleTrans(texture) {
  let width = (texture && texture.width) || 1;
  let height = (texture && texture.height) || 1;
  return Geom3.mat4.fromScaling(new Float32Array(16), [1 / width, 1 / height, 1]);
}

/* [o1,o2,o3,i1,i2,i3] holeIdx = 3 */
function _allPos(face) {
  return face.innerLoops
    .reduce((acc, l) => acc.concat([...l]), [...face.outerLoop])
    .map(v => v.position);
}

function _earcutFix(arrPts, holeInd){
  let trans2D = Geom3.mat4.create();
  let newZ = getPolyNormal(Geom3.vec3.create(), arrPts);
  getArbitraryTransAxesAligned(trans2D, newZ);

  let arr2d = [];
  var vecTmp = Geom3.vec3.create();
  arrPts.forEach(function(pt) {
    Geom3.vec3.transformMat4(vecTmp, pt, trans2D);
    arr2d.push(vecTmp[0]);
    arr2d.push(vecTmp[1]);
  });

  let indices = [];
  try {
    indices = earcut(arr2d, holeInd);
  } catch(e) {
    console.log(e);
  }

  return {
    _allPos: arrPts,
    _indices: indices,
    _trans2D: trans2D,
    _normal: newZ,
  };
}

function _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops) {
  let indices = arrInnerLoops.map(l => l.length);
  let startLen = arrOuterLoop.length;
  indices.unshift(0);
  indices = indices.map(i => i + startLen);
  indices.pop();
  return indices;
}
