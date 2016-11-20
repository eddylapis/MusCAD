/**
 * Initialize or modify GL Program, use shaders and hook up with GL context
 * @param gl
 * @callback cb(maker)
 */

export default function makeProgram(gl, cb) {
  let maker = {};
  maker.target = _target.bind(this, maker);
  maker.create = _create.bind(this, maker, gl);
  maker.link = _link.bind(this, maker, gl);
  maker.use = _use.bind(this, maker, gl);
  maker.setShader = _setShader.bind(this, maker, gl);
  maker.rtnVal = {};

  if (cb) cb.call(this, maker);

  return maker.rtnVal;
}

function _target(maker, glProgram) {
  maker.program = glProgram;
  maker.rtnVal = maker.program;
}

function _create(maker, gl) {
  maker.program = gl.createProgram();
  maker.rtnVal = maker.program;
}

function _link(maker, gl) {
  gl.linkProgram(maker.program);

  if (!gl.getProgramParameter(maker.program, gl.LINK_STATUS)) {
    maker.rtnVal.error = 'Unable to initialize the shader program.';
  }
}

function _use(maker, gl) {
  gl.useProgram(maker.program);
}

function _setShader(maker, gl, shader) {
  gl.attachShader(maker.program, shader);
}
