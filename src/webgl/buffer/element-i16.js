import gl from '../gl';
import BaseBuffer from './base-buffer';

const BYTES_UINT16 = 2;
const VECTOR_DIMENSION = 1;

export default class ElementI16 extends BaseBuffer {
  get bufferType() { return gl.ELEMENT_ARRAY_BUFFER; }
  get byteLen() { return BYTES_UINT16; }
  get drawType() { return gl.DYNAMIC_DRAW; }
  get vecDimension() { return VECTOR_DIMENSION; }
}
