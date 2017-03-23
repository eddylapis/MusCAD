import gl from '../gl';

export default class BaseBuffer {
  constructor() {
    this._location = null;
    this._head = 0;
  }

  get location() { return this._location; }
  get head() { return this._head; }
  get bufferType() { throw('Not Implemented.'); }
  get byteLen() { throw('Not Implemented.'); }
  get drawType() { throw('Not Implemented.'); }
  get vecDimension() { throw('Not Implemented.'); }

  init() { this._location = gl.createBuffer(); }
  bind() { gl.bindBuffer(this.bufferType, this.location); }
  unbind() { gl.bindBuffer(this.bufferType, null); }

  alloc(size) { gl.bufferData(this.bufferType, size * this.byteLen, this.drawType); }
  uploadSub(startIndex, dataView) {
    gl.bufferSubData(this.bufferType, startIndex * this.byteLen * this.vecDimension, dataView);
  }

  append(dataView) {
    let byteLen = dataView.buffer.byteLength;
    gl.bufferSubData(this.bufferType, this.head, dataView);
    this._head += byteLen;
  }
}
