/**
 * A simple perspective camera.
 */

import { mat4, vec3 } from 'geom3';
import BaseCamera from './base-camera';

export default class LookAtCamera extends BaseCamera {
  // Matrix:
  // | R.x U.x B.x t.x |
  // | R.y U.y B.y t.y |
  // | R.z U.z B.z t.z |
  // |   0   0   0   1 |
  // Column Major
  // Data:
  // [
  //   r  r  r  0
  //   u  u  u  0
  //   -f -f -f 0
  //   t  t  t  1
  // ]

  constructor(){
    super();
    // matrices
    this._matProj = new Float32Array(16);
    this._matView = new Float32Array(16);
    this._matCamera = new Float32Array(16);

    // extrinsic props
    this._updateMatCameraByLookAt([0, 0, 4000], [0, 1, 0], [0, 0, 0]);
    this._updateMatViewByMatCamera();

    // intrinsic perspective props
    this._fovy = 50 / 180 * Math.PI;
    this._aspect = 1;
    this._near = 0.1;
    this._far = 200000;

    mat4.perspective(this._matProj,
        this.fovy, this.aspect, this.near, this.far);
  }

  // matrix
  get matProj() { return this._matProj; }
  get matView() { return this._matView; }
  get matCamera() { return this._matCamera; }

  lookAt(eye, target, up) {
    this._updateMatCameraByLookAt(eye, target, up);
    this._updateMatViewByMatCamera();
    this.emitViewChange();
  }

  updateMatCamera(m) {
    mat4.copy(this._matCamera, m);
    this._updateMatViewByMatCamera();
    this.emitViewChange();
  }

  _updateMatCameraByLookAt(eye, target, up) {
    let f = vec3.normalize([],
                 vec3.subtract([], target, eye)),
        r = vec3.cross([], f, up),
        b = vec3.negate([], f),
        u = up,
        e = eye;

    return mat4.copy(this._matCamera, [
      r[0], r[1], r[2], 0,
      u[0], u[1], u[2], 0,
      b[0], b[1], b[2], 0,
      e[0], e[1], e[2], 1,
    ]);
  }

  _updateMatViewByMatCamera() {
    return mat4.invert(this._matView, this._matCamera);
  }

  // extrinsic
  get xaxis() { return [this._matCamera[0], this._matCamera[1], this._matCamera[2]]; }
  get yaxis() { return [this._matCamera[4], this._matCamera[5], this._matCamera[6]]; }
  get zaxis() { return [this._matCamera[8], this._matCamera[9], this._matCamera[10]]; }
  get eye() { return [this._matCamera[12], this._matCamera[13], this._matCamera[14]]; }

  // intrinsic
  get fovy() { return this._fovy; }
  get aspect() { return this._aspect; }
  get near() { return this._near; }
  get far() { return this._far; }
}
