/**
 * Compile shader sources to be used in a GL Program
 * @param gl
 * @callback cb(maker)
 */

export default function makeShader(gl, cb) {
  let maker = {};
  maker.compileVertex = _compileVertex.bind(this, maker, gl);
  maker.compileFragment = _compileFragment.bind(this, maker, gl);
  maker.rtnVal = {};

  if (cb) cb.call(this, maker);

  return maker.rtnVal;
}

function _compileVertex(maker, gl) {
  _compileShader(maker
    , gl
    , gl.createShader(gl.VERTEX_SHADER)
  );
}

function _compileFragment(maker, gl) {
  _compileShader(maker
    , gl
    , gl.createShader(gl.FRAGMENT_SHADER)
  );
}

function _compileShader(maker, gl, shader) {
  let shaderSrc = maker.src;

  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    maker.rtnVal = { error: gl.getShaderInfoLog(shader) };
  } else {
    maker.rtnVal = shader;
  }
}
