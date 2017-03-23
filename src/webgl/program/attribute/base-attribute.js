import gl from '../../gl';

export class BaseAttribute {
  constructor(name, isArray=false) {
    this._name = name;
    this._location = null;
    this.isArray = isArray;
  }

  get name() { return this._name; }
  get location() { return this._location; }

  initLocation(program) {
    this._location = gl.getAttribLocation(program, this.name);
  }

  enableArray() { return; }
  disableArray() { return; }

  update() { throw('Not Implemented'); }
}

export class BaseArrayAttribute extends BaseAttribute {
  initLocation(...args) {
    super.initLocation(...args);

    this.enableArray();
  }

  enableArray() { gl.enableVertexAttribArray(this.location); }
  disableArray() { gl.disableVertexAttribArray(this.location); }

  attrPointer() { throw('Not Implemented'); }
}
