import test from 'tape';
import { gl, lastArgCalled, requireKlass } from './helper';

let klass = requireKlass('texture-trans');

test('init writes location', (t) => {
  const intRandomLocation = 17;

  gl.createTexture.returns(intRandomLocation);

  let buffer = new klass();
  buffer.init();

  t.equal(buffer.location, intRandomLocation);
  t.end();
});

test('bind binds self', (t) => {
  const intRandomLocation = 17;

  gl.createTexture.returns(intRandomLocation);

  let buffer = new klass();
  buffer.init();
  buffer.bind();

  t.equal(lastArgCalled(gl.bindTexture, 1), intRandomLocation);
  t.end();
});


test('alloc initializes with correct data size', (t) => {
  let float32Len = 4;
  let numOfElementsRGBA = 4;

  gl.texImage2D.reset()

  let buffer = new klass();
  buffer.alloc();

  let dataView = lastArgCalled(gl.texImage2D, 8);

  t.equal(
    4096 * 256 * float32Len * numOfElementsRGBA,
    dataView.buffer.byteLength
  );
  t.end();
});

test('uploadSub writes to correct byte location', (t) => {
  let x = 1, y = 2, dx = 3, dy = 4;

  gl.texSubImage2D.reset()

  let buffer = new klass();
  let dataView = [];
  buffer.uploadSub(x, y, dx, dy, dataView);

  t.equal(lastArgCalled(gl.texSubImage2D, 2), x);
  t.equal(lastArgCalled(gl.texSubImage2D, 3), y);
  t.equal(lastArgCalled(gl.texSubImage2D, 4), dx);
  t.equal(lastArgCalled(gl.texSubImage2D, 5), dy);
  t.end();
});

test('append writes to correct byte location', (t) => {
  let trans = new Float32Array(16);

  gl.texSubImage2D.reset()

  let buffer = new klass();
  buffer.append(trans);

  t.equal(lastArgCalled(gl.texSubImage2D, 2), 0);
  t.equal(lastArgCalled(gl.texSubImage2D, 3), 0);
  t.equal(lastArgCalled(gl.texSubImage2D, 4), 4);
  t.equal(lastArgCalled(gl.texSubImage2D, 5), 1);
  t.end();
});

test('append updates head', (t) => {
  const bytesPerMatrix = 64;
  let trans = new Float32Array(16);

  gl.texSubImage2D.reset()

  let buffer = new klass();
  buffer.append(trans);

  t.equal(buffer.head, bytesPerMatrix);
  t.end();
});

test('append writes to the correct dy', (t) => {
  const bytesPerMatrix = 64;
  const matricesPerRow = 1024;
  let trans = new Float32Array(16);

  gl.texSubImage2D.reset()

  let yFilled = 123;
  let buffer = new klass();
  buffer._head = bytesPerMatrix * matricesPerRow * yFilled;
  buffer.append(trans);

  t.equal(lastArgCalled(gl.texSubImage2D, 3), yFilled);
  t.end();
});
