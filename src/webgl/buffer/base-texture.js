import gl from '../gl';
import BaseBuffer from './base-buffer';

const ELEMENTS_PER_PIXEL = 4;

export default class BaseTexture extends BaseBuffer {
  constructor() {
    super();

    this._level = 0;
    this._internalformat = gl.RGBA;
    this._border = 0;
    this._format = gl.RGBA;
  }

  get level() { return this._level; }
  get internalformat() { return this._internalformat; }
  get format() { return this._format; }
  get border() { return this._border; }
  get bufferType() { return gl.TEXTURE_2D; }
  get texelType() { throw('Not Implemented.'); }
  get dataViewKlass() { throw('Not Implemented.'); }

  init() { this._location = gl.createTexture(); }
  active0() { gl.activeTexture(gl.TEXTURE0); }
  active1() { gl.activeTexture(gl.TEXTURE1); }
  bind() { gl.bindTexture(this.bufferType, this.location); }
  unbind() { gl.bindTexture(this.bufferType, null); }

  alloc(width, height) {
    gl.texImage2D(
      this.bufferType,
      this.level,
      this.internalformat,
      width,
      height,
      this.border,
      this.format,
      this.texelType,
      new this.dataViewKlass(ELEMENTS_PER_PIXEL * width * height)
    );
  }

  upload(imageDataView) {
    gl.texImage2D(
      this.bufferType,
      this.level,
      this.internalformat,
      imageDataView.width,
      imageDataView.height,
      this.border,
      this.format,
      this.texelType,
      new this.dataViewKlass(imageDataView.data)
    );
  }

  uploadSub(x, y, dx, dy, dataView) {
    gl.texSubImage2D(
      this.bufferType,
      this.level,
      x, y, dx, dy,
      this.format,
      this.texelType,
      dataView
    );
  }

  append() { throw('Not Implemented.'); }
}
