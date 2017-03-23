import test from 'tape';
import { gl, lastArgCalled, requireKlass } from './helper';

let klass = requireKlass('texture-byte');

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
  const width = 2;
  const height = 3;
  const numOfElementsRGBA = 4;
  const oneByte = 1;

  gl.texImage2D.reset()

  let buffer = new klass();
  buffer.alloc(width, height);

  t.equal(
    lastArgCalled(gl.texImage2D, 8).buffer.byteLength,
    width * height * numOfElementsRGBA * oneByte
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
