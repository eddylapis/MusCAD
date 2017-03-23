import {
  gl,
  lastArgCalled,
  genRequire,
} from '../helper';

module.exports = {
  gl,
  lastArgCalled,
  requireProgram: genRequire('program/'),
  requireShader: genRequire('shader/'),
};
