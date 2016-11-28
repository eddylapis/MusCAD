/**
 * provides functions to
 *   - create buffers
 *   - update buffer data
 *   - switch current working buffers
 * also serves as a storage for
 *   - all buffer pointers
 * and potentially
 *   - dynamically resize and update buffers
 */

const BYTES_FLOAT32 = 4;
const BYTES_UINT16 = 2;
const arrayDimension = 3;
const _bytesToIndex = (v) => v / BYTES_FLOAT32 / arrayDimension;

class BufferContext {
  constructor() {
    this._gl = null;
    this._buffers = {};
    this._buffersHead = {};
    this._currentArray = null;
    this._currentElement = null;
    this._currentTexture = null;
  }

  get gl() { return this._gl; }
  get buffers() { return this._buffers; }

  initialize(gl, cb) {
    this._gl = gl;
    if (cb) cb.call(this, this, this.buffers);
  }

  head(bufferName) { return this._buffersHead[bufferName]; }
  headIndex(bufferName) { return _bytesToIndex(this.head(bufferName)); }
  headIndexDiff(bufferName, typedArray) {
    return _bytesToIndex(this.head(bufferName) - typedArray.buffer.byteLength);
  }

  initBuffer(bufferName) {
    this._buffers[bufferName] = this.gl.createBuffer();
  }

  initTexture(bufferName) {
    this._buffers[bufferName] = this.gl.createTexture();
  }

  bindArray(bufferName) {
    this._currentArray = bufferName;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[bufferName]);
  }

  unBindArray() {
    this._currentArray = null;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  withArray(bufferName, cb) {
    this.bindArray(bufferName);

    if (cb) cb.call(this, this);

    this.unBindArray();
  }

  bindElement(bufferName) {
    this._currentElement = bufferName;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[bufferName]);
  }

  unBindElement() {
    this._currentElement = null;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  withElement(bufferName, cb) {
    this.bindElement(bufferName);

    if (cb) cb.call(this, this);

    this.unBindElement();
  }

  bindTex2d(bufferName) {
    this._currentTexture = bufferName;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.buffers[bufferName]);
  }

  unBindTex2d() {
    this._currentTexture = null;
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  allocArray(size) {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, size * BYTES_FLOAT32, this.gl.DYNAMIC_DRAW);
  }

  allocElement(size) {
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, size * BYTES_UINT16, this.gl.DYNAMIC_DRAW);
  }

  allocTex2df(width, height) {
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      width,
      height,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      new Float32Array(BYTES_FLOAT32 * width * height)
    );
  }

  uploadTex2df(x, y, dx, dy, dataView) {
    this.gl.texSubImage2D(
      this.gl.TEXTURE_2D,
      0,
      x, y, dx, dy,
      this.gl.RGBA,
      this.gl.FLOAT,
      dataView
    );
  }

  appendTex2df(dataView) {
    let transWidth = 4096;
    let byteLen = dataView.buffer.byteLength;
    let head = this._buffersHead[this._currentTexture] || 0;
    let totalX = head / 16; // 64 bytes -> 4 pixels
    let x = totalX % transWidth;
    let y = Math.floor(totalX / transWidth);

    this.gl.texSubImage2D(
      this.gl.TEXTURE_2D,
      0,
      x, y, 4, 1,
      this.gl.RGBA,
      this.gl.FLOAT,
      dataView
    );

    this._buffersHead[this._currentTexture] = head + byteLen;
  }

  uploadArray(startIndex, dataView) {
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, startIndex * BYTES_FLOAT32 * arrayDimension, dataView);
  }

  uploadElement(startIndex, dataView) {
    this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, startIndex * BYTES_UINT16, dataView);
  }

  appendArray(dataView) {
    let byteLen = dataView.buffer.byteLength;
    let head = this._buffersHead[this._currentArray] || 0;
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, head, dataView);
    this._buffersHead[this._currentArray] = head + byteLen;
  }

  appendElement(dataView) {
    let byteLen = dataView.buffer.byteLength;
    let head = this._buffersHead[this._currentElement] || 0;
    this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, head, dataView);
    this._buffersHead[this._currentElement] = head + byteLen;
  }
}

const instance = new BufferContext();

module.exports = instance;
