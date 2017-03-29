/**
 * Workspace serves as the container for Canvas and GL Context.
 * @class Workspace
 * @namespace window
 */

import Canvas from './canvas';
import getGL from './get-gl';
import forever from './forever';
import {delegateEvents} from './canvas-events';
import {mat4, vec3, vec4} from 'geom3';

import CameraEvents from '../camera/camera-events';

class Workspace {
  constructor() {
    this._canvas = null;
    this._gl = null;
    this._extIns = null;
    this._activeTool = null;
    this._retinaFactor = 2;
  }

  get canvas() { return this._canvas; }
  get displayWidth() {
    return parseFloat(this.canvas.style.width || this.canvas.width);
  }
  get displayHeight() {
    return parseFloat(this.canvas.style.height || this.canvas.height);
  }
  get gl() { return this._gl; }
  get extIns() { return this._extIns; }
  get activeTool() { return this._activeTool; }
  selectTool(v) { this._activeTool = v; }

  createCanvas() { this._canvas = Canvas.create(); }
  appendCanvas(id) {
    document.getElementById(id).appendChild(this.canvas);
  }
  resizeCanvas(w, h) {
    this.canvas.width = this._retinaFactor * w;
    this.canvas.height = this._retinaFactor * h;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.gl.viewport(0, 0, this._retinaFactor * w, this._retinaFactor * h);
  }

  registerGL() {
    let gl = getGL(this.canvas);
    this._gl = gl;
    this._extIns = gl.getExtension('ANGLE_instanced_arrays'); // not used for now
  }

  initialize(cb) {
    if (cb) cb.call(this, this);
  }

  initCamera(onViewChange, onProjChange) {
    CameraEvents.listenViewChange(onViewChange);
    CameraEvents.listenProjChange(onProjChange);
  }

  initEvents() { delegateEvents(this.canvas, this); }

  forever(cb) { forever(cb); }

  get procToScreen() {
    return _procToScreen.bind(
      this,
      this.displayWidth, this.displayHeight,
      this.camera.matProj, this.camera.matView
    );
  }
}

const instance = new Workspace();

module.exports = instance;

function _procToScreen(w, h, matProj, matView, pt, matIns) {
  let trans = mat4.create();
  if (matIns) {
    mat4.mul(trans, matProj,
    mat4.mul([], matView,
    matIns
    ));
  } else {
    mat4.mul(trans, matProj, matView);
  }

  let pt4d = vec4.transformMat4([], [pt[0], pt[1], pt[2], 1], trans);

  let x = (1 + pt4d[0] / pt4d[3]) / 2.0 * w,
      y = (1 - pt4d[1] / pt4d[3]) / 2.0 * h,
      depth = pt4d[2];

  return [x, y, depth];
}
