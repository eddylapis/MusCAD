import gl from '../gl';
import extIns from '../ext-ins';
import constructUniform from './uniform/construct-uniform';
import constructAttribute from './attribute/construct-attribute';

export default class BasicProgram {
  constructor(cb) {
    this._location = null;

    this._currentVertexIns = null;
    this._currentFragmentIns = null;

    this._uniformInsList = {};
    this._attributeInsList = {};

    this.gl = gl;
    this.extIns = extIns;

    if (cb) cb.call(this, this);
  }

  get location() { return this._location; }

  get vertexIns() { return this._currentVertexIns; }
  get fragmentIns() { return this._currentFragmentIns; }

  create() { this._location = gl.createProgram(); }
  link() {
    gl.linkProgram(this.location);

    if (!gl.getProgramParameter(this.location, gl.LINK_STATUS)) {
      throw({ error: 'Unable to initialize the shader program.'});
    }
  }

  registerUniforms() {
    let list = this.vertexIns.getUniformList();

    list.forEach(e => {
      let {key, value} = constructUniform(e, this.location);

      this._uniformInsList[key] = value;
    });
  }

  updateUniform(name, value) {
    let uniformIns = this._uniformInsList[name];
    if (!uniformIns) throw('Uninitialized uniform: ' + name);

    uniformIns.update(value);
  }

  registerAttributes() {
    let list = this.vertexIns.getAttributeList();

    list.forEach(e => {
      let {key, value} = constructAttribute(e, this.location);

      this._attributeInsList[key] = value;
    });
  }

  updateAttribute(name, value) {
    let attrIns = this._attributeInsList[name];
    if (!attrIns) throw('Uninitialized attribute: ' + name);

    attrIns.update(value);
  }

  enableArray(name) {
    let attrIns = this._attributeInsList[name];
    if (!attrIns) throw('Uninitialized attribute: ' + name);

    attrIns.enableArray();
  }

  enableArrayAll() {
    for (let name in this._attributeInsList) {
      this._attributeInsList[name].enableArray();
    }
  }

  disableArray(name) {
    let attrIns = this._attributeInsList[name];
    if (!attrIns) throw('Uninitialized attribute: ' + name);

    attrIns.disableArray();
  }

  disableArrayAll() {
    for (let name in this._attributeInsList) {
      this._attributeInsList[name].disableArray();
    }
  }

  updateAttrPointer(name, stride=0, offset=0) {
    let attrIns = this._attributeInsList[name];
    if (!attrIns) throw('Uninitialized attribute: ' + name);

    attrIns.attrPointer(stride, offset);
  }

  updateAttrDivisor(name, divisor) {
    let attrIns = this._attributeInsList[name];
    if (!attrIns) throw('Uninitialized attribute: ' + name);

    attrIns.attrDivisor(divisor);
  }

  tmp() {
    let values = {};
    for (let k in this._uniformInsList) {
      values[k] = gl.getUniform(
        this.location,
        this._uniformInsList[k].location
      );
    }

    console.log(values);
  }

  use() { gl.useProgram(this.location); }
  attachShader(shader) { gl.attachShader(this.location, shader); }

  attachVertexIns(shaderInstance) {
    this._currentVertexIns = shaderInstance;
    gl.attachShader(this.location, shaderInstance.location);
  }

  attachFragmentIns(shaderInstance) {
    this._currentFragmentIns = shaderInstance;
    gl.attachShader(this.location, shaderInstance.location);
  }

  detachVertexIns() {
    gl.detachShader(this.location, this.vertexIns.location);
    this._currentVertexIns = null;
  }

  detachFragmentIns() {
    gl.detachShader(this.location, this.fragmentIns.location);
    this._currentFragmentIns = null;
  }
}
