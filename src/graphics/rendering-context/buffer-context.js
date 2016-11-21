/**
 * provides functions to
 *   - create buffers
 *   - update buffer data
 *   - switch current working buffers
 * also serves as a storage for
 *   - all buffer data
 * and potentially
 *   - dynamically resize and update buffers
 */

const bytesForArray = 4;
const bytesForElement = 2;

class BufferContext {
  constructor() {
    this._gl = null;
    this._buffers = {};
  }

  get gl() { return this._gl; }
  get buffers() { return this._buffers; }

  initialize(gl, cb) {
    this._gl = gl;
    if (cb) cb.call(this, this, this.buffers);
  }

  initBuffer(bufferName) {
    this._buffers[bufferName] = this.gl.createBuffer();
  }

  bindArray(bufferName) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[bufferName]);
  }

  bindElement(bufferName) {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[bufferName]);
  }

  allocArray(size) {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, size * bytesForArray, this.gl.DYNAMIC_DRAW);
  }

  allocElement(size) {
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, size * bytesForElement, this.gl.DYNAMIC_DRAW);
  }

  uploadArray(bufferName, startIndex, data) {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, startIndex * bytesForArray, data);
  }

  uploadElement(bufferName, startIndex, data) {
    this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, startIndex * bytesForElement, data);
  }
}

const instance = new BufferContext();

module.exports = instance;
