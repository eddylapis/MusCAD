/**
 * A simple perspective camera.
 */

import { mat4 } from 'geom3';

import CameraEvents from './camera-events';

export default class DefaultCamera {
  constructor(){
    this._matProjection = mat4.create();

    // extrinsic props

    // column-major
    // |x0,x1,x2,t0|
    // |y0,y1,y2,t1|  =>  [x0,y0,z0,0,x1,y1,z1,0,z2,y2,z2,0,t0,t1,t2,1]
    // |z0,z1,z2,t2|
    // |0 , 0, 0, 1|

    this._matCamera = mat4.create();

    this._matCamera[12] = 0;     //x
    this._matCamera[13] = 0;     //y
    this._matCamera[14] = 10;    //z

    // intrinsic perspective props
    this._fovy = 50 / 180 * Math.PI;
    this._aspect = 1;
    this._near = 0.1;
    this._far = 200000;

    mat4.perspective(this._matProjection,
        this.fovy, this.aspect, this.near, this.far);
  }

  // matrix
  get matProjection() { return this._matProjection; }
  get matCamera() { return this._matCamera; }
  get matView() { return mat4.invert(mat4.create(), this._matCamera); }

  // extrinsic
  get xaxis() { return [this.matCamera[0], this.matCamera[4], this.matCamera[8]]; }
  get yaxis() { return [this.matCamera[1], this.matCamera[5], this.matCamera[9]]; }
  get zaxis() { return [this.matCamera[2], this.matCamera[6], this.matCamera[10]]; }

  get x() { return this.matCamera[12]; }
  get y() { return this.matCamera[13]; }
  get z() { return this.matCamera[14]; }
  get eye() { return [this.x, this.y, this.z]; }

  // intrinsic
  get fovy() { return this._fovy; }
  get aspect() { return this._aspect; }
  get near() { return this._near; }
  get far() { return this._far; }

  setEye(eye) {
    this._matCamera[12] = eye[0]; // x
    this._matCamera[13] = eye[1]; // y
    this._matCamera[14] = eye[2]; // z

    this.emitViewChange();
  }

  emitViewChange() { CameraEvents.emitViewChange(this, this.matView); }
  emitProjChange() { CameraEvents.emitProjChange(this, this.matProjection); }
}
