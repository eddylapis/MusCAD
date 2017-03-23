import gl from '../../gl';
import BaseUniform from './base-uniform';

export class UniformBool extends BaseUniform {
  update(v) { gl.uniform1i(this.location, v); }
}

export class Uniform1I extends BaseUniform {
  update(v) { gl.uniform1i(this.location, v); }
}

export class Uniform1F extends BaseUniform {
  update(v) { gl.uniform1f(this.location, v); }
}

export class Uniform3F extends BaseUniform {
  update(v) { gl.uniform3fv(this.location, v); }
}

export class Uniform4F extends BaseUniform {
  update(v) { gl.uniform4fv(this.location, v); }
}

export class UniformMat4F extends BaseUniform {
  update(v) { gl.uniformMatrix4fv(this.location, false, v); }
}
