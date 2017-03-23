import gl from '../gl';
import BaseTexture from './base-texture';

const BYTES_FLOAT32     = 4;
const BYTES_PER_PIXEL   = 4 * BYTES_FLOAT32;
const BYTES_PER_MATRIX  = BYTES_FLOAT32 * 16;
const PIXELS_PER_MATRIX = 4;
const PIXEL_DY          = 1;
const MATRICES_PER_ROW  = 1024;
const TEX_WIDTH         = MATRICES_PER_ROW * PIXELS_PER_MATRIX;
const TEX_HEIGHT        = 256;

export default class TextureTrans extends BaseTexture {
  get texelType() { return gl.FLOAT; }
  get dataViewKlass() { return Float32Array; }

  alloc() { super.alloc(TEX_WIDTH, TEX_HEIGHT); }

  append(dataView) {
    let byteLen = dataView.buffer.byteLength;
    if (byteLen !== BYTES_PER_MATRIX) {
      throw('Transformation Matrix needs to be a Float32Array of 16 Elements.');
    }

    let totalX = this.head / BYTES_PER_PIXEL, // 64 bytes -> 4 pixels
        x      = totalX % TEX_WIDTH,
        y      = Math.floor(totalX / TEX_WIDTH);

    this.uploadSub(x, y, PIXELS_PER_MATRIX, PIXEL_DY, dataView);

    this._head += byteLen;
  }
}
