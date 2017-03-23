import test from 'tape';

import {
  gl,
  lastArgCalled,
  requireProgram,
  requireShader,
} from './helper';

let klass = requireProgram('basic');
let vertexShaderMock = {
  getAttributeList: () => [
    {name: 'vec3Dummy', type: 'vec3', array: false},
  ],
};
let fragmentShaderMock = {};

test('registerAttributes sets up attrib setters', (t) => {
  const intRandomLocation = 13;
  gl.getAttribLocation.returns(intRandomLocation);

  let program = new klass();

  program.attachVertexIns(vertexShaderMock);
  program.attachFragmentIns(fragmentShaderMock);

  program.registerAttributes();
  program.updateAttribute('vec3Dummy', [1,1,0]);

  t.equal(
    lastArgCalled(gl.vertexAttrib3f, 0),
    intRandomLocation
  );

  t.deepEqual(
    lastArgCalled(gl.vertexAttrib3f, 1),
    [1,1,0]
  );

  t.end();
});

test('registerAttributes calls enableVertexAttribArray', (t) => {
  const intRandomLocation = 14;
  const bytes_f32 = 4;
  gl.getAttribLocation.returns(intRandomLocation);

  let program = new klass();

  program.attachVertexIns({
    getAttributeList: () => [
      {name: 'vec3ArrayDummy', type: 'vec3', array: true},
    ],
  });
  program.attachFragmentIns(fragmentShaderMock);

  program.registerAttributes();
  program.updateAttrPointer('vec3ArrayDummy', 1, 2);

  t.equal(
    lastArgCalled(gl.enableVertexAttribArray, 0),
    intRandomLocation
  );

  t.equal(
    lastArgCalled(gl.vertexAttribPointer, 0),
    intRandomLocation
  );

  t.equal(
    lastArgCalled(gl.vertexAttribPointer, 1),
    3
  );

  t.equal(
    lastArgCalled(gl.vertexAttribPointer, 4),
    1 * bytes_f32
  );

  t.equal(
    lastArgCalled(gl.vertexAttribPointer, 5),
    2 * bytes_f32
  );


  t.end();
});
