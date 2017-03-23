import gl from '../gl';

export default class BasicShader {
  constructor(cb) {
    this._location = null;
    if (cb) cb.call(this, this);
  }

  get location() { return this._location; }
  get shaderType() { throw('Not Implemented.'); }
  get src() { throw('Not Implemented.'); }

  compile() {
    this._location = gl.createShader(this.shaderType);

    gl.shaderSource(this.location, this.src);
    gl.compileShader(this.location);

    if (!gl.getShaderParameter(this.location, gl.COMPILE_STATUS)) {
      throw({ error: gl.getShaderInfoLog(this.location) });
    }

    return this.location;
  }

  getUniformList() { return []; }
}
