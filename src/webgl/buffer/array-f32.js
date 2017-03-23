import gl from '../gl';
import BaseBuffer from './base-buffer';

const BYTES_FLOAT32 = 4;
const VECTOR_DIMENSION = 3;

export default class ArrayF32 extends BaseBuffer {
  get bufferType() { return gl.ARRAY_BUFFER; }
  get byteLen() { return BYTES_FLOAT32; }
  get drawType() { return gl.DYNAMIC_DRAW; }
  get vecDimension() { return VECTOR_DIMENSION; }
}
