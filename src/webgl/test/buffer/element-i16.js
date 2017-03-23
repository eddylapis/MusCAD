import test from 'tape';
import { gl, lastArgCalled, requireKlass } from './helper';

let klass = requireKlass('element-i16');

test('init writes location', (t) => {
  const intRandomLocation = 17;

  gl.createBuffer.returns(intRandomLocation);

  let buffer = new klass();
  buffer.init();

  t.equal(buffer.location, intRandomLocation);
  t.end();
});

test('bind binds self', (t) => {
  const intRandomLocation = 17;

  gl.createBuffer.returns(intRandomLocation);

  let buffer = new klass();
  buffer.init();
  buffer.bind();

  t.equal(lastArgCalled(gl.bindBuffer, 1), intRandomLocation);
  t.end();
});


test('alloc initializes with correct data size', (t) => {
  const numberOfCoords = 2;
  const uint16Len = 2;

  gl.bufferData.reset()

  let buffer = new klass();
  buffer.alloc(numberOfCoords);

  t.equal(lastArgCalled(gl.bufferData, 1), uint16Len * numberOfCoords);
  t.end();
});

test('uploadSub writes to correct byte location', (t) => {
  const uint16Len = 2;

  gl.bufferSubData.reset()

  let buffer = new klass();
  let dataView = [];
  let i = 10;
  buffer.uploadSub(i, dataView);

  t.equal(lastArgCalled(gl.bufferSubData, 1), uint16Len * i);
  t.end();
});

test('append updates head according to byte length of DataView', (t) => {
  let buffer = new klass();
  let dataView = new Float32Array([1,2,3,4]);
  let byteLen = 4 * 4;

  buffer.append(dataView);

  t.equal(buffer.head, byteLen);
  t.end();
});
