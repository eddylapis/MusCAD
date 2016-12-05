/**
 * Workspace serves as the container for Canvas and GL Context.
 * @class Workspace
 * @namespace window
 */

import Canvas from './canvas';
import getGL from './get-gl';
import forever from './forever';
import {delegateEvents} from './canvas-events';

import CameraEvents from '../camera/camera-events';

class Workspace {
  constructor() {
    this._canvas = null;
    this._gl = null;
    this._glProgram = null;
    this._activeTool = null;
  }

  get canvas() { return this._canvas; }
  get displayWidth() {
    return parseFloat(this.canvas.style.width || this.canvas.width);
  }
  get displayHeight() {
    return parseFloat(this.canvas.style.height || this.canvas.height);
  }
  get gl() { return this._gl; }
  get glProgram() { return this._glProgram; }
  set glProgram(v) { this._glProgram = v; }
  get activeTool() { return this._activeTool; }
  selectTool(v) { this._activeTool = v; }

  createCanvas() { this._canvas = Canvas.create(); }
  appendCanvas(id) {
    document.getElementById(id).appendChild(this.canvas);
  }

  registerGL() { this._gl = getGL(this.canvas); }

  initialize(cb) {
    if (cb) cb.call(this, this);
  }

  initCamera(onViewChange, onProjChange) {
    CameraEvents.listenViewChange(onViewChange);
    CameraEvents.listenProjChange(onProjChange);
  }

  initEvents() { delegateEvents(this.canvas, this); }

  forever(cb) { forever(cb); }
}

const instance = new Workspace();

module.exports = instance;
