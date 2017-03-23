import test from 'tape';

import {
  gl,
  lastArgCalled,
  requireProgram,
  requireShader,
} from './helper';

let klass = requireProgram('basic');
let vertexShaderMock = {
  getUniformList: () => [
    {name: 'boolDummy', type: 'bool'},
  ],
};
let fragmentShaderMock = {};

test('attach sets shader instances', (t) => {
  let program = new klass();

  program.attachVertexIns(vertexShaderMock);
  program.attachFragmentIns(fragmentShaderMock);

  t.equal(vertexShaderMock, program.vertexIns);
  t.equal(fragmentShaderMock, program.fragmentIns);
  t.end();
});

test('registerUniforms sets up uniform setters', (t) => {
  const intRandomLocation = 12;
  gl.getUniformLocation.returns(intRandomLocation);

  let program = new klass();

  program.attachVertexIns(vertexShaderMock);
  program.attachFragmentIns(fragmentShaderMock);

  program.registerUniforms();
  program.updateUniform('boolDummy', false);

  t.equal(
    lastArgCalled(gl.uniform1i, 0),
    intRandomLocation
  );

  t.equal(
    lastArgCalled(gl.uniform1i, 1),
    false
  );

  t.end();
});
