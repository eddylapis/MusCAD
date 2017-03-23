import sinon from 'sinon';
import proxyquire from 'proxyquire';

let gl = {};

gl.createBuffer = sinon.stub();
gl.bindBuffer = sinon.spy();
gl.bufferData = sinon.spy();
gl.bufferSubData = sinon.spy();
gl.createTexture = sinon.stub();
gl.bindTexture = sinon.spy();
gl.texImage2D = sinon.spy();
gl.texSubImage2D = sinon.spy();
gl.attachShader = sinon.spy();
gl.detachShader = sinon.spy();
gl.getUniformLocation = sinon.stub();
gl.getAttribLocation = sinon.stub();
gl.enableVertexAttribArray = sinon.spy();
gl.disableVertexAttribArray = sinon.spy();
gl.vertexAttribPointer = sinon.spy();

gl.vertexAttrib3f = sinon.spy();
gl.uniform1i = sinon.spy();

gl.FLOAT = 'gl.FLOAT';

let lastArgCalled = (s, i) =>
  (typeof 0 === 'number') ? s.args[s.args.length-1][i] : s.args[s.args.length-1];

gl['@global'] = true;

let rootPath = '../';

let genRequire = (path) => {
  let requireKlass = (fn) => {
    return proxyquire
      .noCallThru()
      .load(rootPath + path + fn, {
        '../gl': gl,
        '../../gl': gl,
      });
  };

  return requireKlass;
};

module.exports = {
  gl,
  lastArgCalled,
  genRequire,
};
