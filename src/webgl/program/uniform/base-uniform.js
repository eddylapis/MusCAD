import gl from '../../gl';

export default class BaseUniform {
  constructor(name) {
    this._name = name;
    this._location = null;
  }

  get name() { return this._name; }
  get location() { return this._location; }

  initLocation(program) {
    this._location = gl.getUniformLocation(program, this.name);
  }

  update() { throw('Not Implemented'); }
}
