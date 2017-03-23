import {
  gl,
  lastArgCalled,
  genRequire,
} from '../helper';

module.exports = {
  gl,
  lastArgCalled,
  requireKlass: genRequire('buffer/'),
};
