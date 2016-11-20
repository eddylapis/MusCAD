/**
 * Sets redering state of GL Context
 * @param gl
 * @callback cb(maker)
 */

export default function setRenderingState(gl, cb) {
  let worker = {};
  worker.defineFront = _defineFront.bind(this, gl);
  worker.drawFrontOnly = _drawFrontOnly.bind(this, gl);
  worker.depthTest = _depthTest.bind(this, gl);
  worker.blendTexture = _blendTexture.bind(this, gl);
  worker.rtnVal = {};

  if (cb) cb.call(this, worker);

  return worker.rtnVal;
}

function _defineFront(gl) { gl.frontFace(gl.CCW); }
function _drawFrontOnly(gl) { gl.enable(gl.CULL_FACE); }
function _depthTest(gl) { gl.enable(gl.CULL_FACE); }

function _blendTexture(gl) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}
