import gl from '../gl';
import BaseTexture from './base-texture';

const BYTES_UINT8 = 1;

export default class TextureByte extends BaseTexture {
  get texelType() { return gl.UNSIGNED_BYTE; }
  get dataViewKlass() { return Uint8Array; }
}
