/**
 * provides functions to
 *   - get attribute and uniform locations of a program
 *   - assign value or pointers to shader variables
 * also serves as a storage for
 *   - all pointers to shader variables
 */

const bytesForArray = 4;

export default class ProgramContext {
  constructor(gl, glProgram) {
    this._gl = gl;
    this._glProgram = glProgram;
    this._attributes = {};
    this._uniforms = {};
  }

  get gl() { return this._gl; }
  get glProgram() { return this._glProgram; }
  get attributes() { return this._attributes; }
  get uniforms() { return this._uniforms; }

  initialize(gl, glProgram, cb) {
    this._gl = gl;
    this._glProgram = gl;
    if (cb) cb.call(this, this, this.buffers);
  }

  initAttr(attrName) {
    this.attributes[attrName] = this.gl.getAttribLocation(this.glProgram, attrName);
  }

  enableAttrArray(attrName) {
    this.gl.enableVertexAttribArray(this.attributes[attrName]);
  }

  attrPointer3f(attrName, stride=0, offset=0) {
    this.gl.vertexAttribPointer(
      this.attributes[attrName],
      3,
      this.gl.FLOAT,
      false,
      stride * bytesForArray,
      offset * bytesForArray
    );
  }

  initUniform(uniformName) {
    this.uniforms[uniformName] = this.gl.getUniformLocation(this.glProgram, uniformName);
  }

  uniformMat4(uniformName, matrix) {
    this.gl.uniformMatrix4fv(this.uniforms[uniformName], false, matrix);
  }
}
