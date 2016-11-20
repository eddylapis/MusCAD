/**
 * Workspace serves as the container for Canvas and GL Context.
 * @class Workspace
 * @namespace window
 */

import Canvas from './Canvas';
import getGL from './getGL';

class Workspace {
  constructor() {
    this._canvas = null;
    this._gl = null;
    this._glProgram = null;
  }

  get canvas() { return this._canvas; }
  get gl() { return this._gl; }
  get glProgram() { return this._glProgram; }
  set glProgram(v) { this._glProgram = v; }

  createCanvas() { this._canvas = Canvas.create(); }
  appendCanvas(id) {
    document.getElementById(id).appendChild(this.canvas);
  }

  registerGL() { this._gl = getGL(this.canvas); }

  initialize(cb) {
    if (cb) cb.call(this, this);
  }
}

const instance = new Workspace();

module.exports = instance;
