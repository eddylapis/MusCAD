let _debugHash = {};

export default class BaseElement {
  constructor() {
    this.constructor.idCounter = this.constructor.idCounter || 0;
    this.constructor.idCounter += 1;
    let shortcut = this.constructor.name.split(/(?=[A-Z])/).map(e => e[0]).join('');

    // for assisting development only
    this.name = `${shortcut}${this.constructor.idCounter}`;

    this.__insid__ = this.constructor.idCounter;

    _debugHash[this.name] = this;
  }

  get __objid__() { return `${this.constructor.name}${this.__insid__}`; }

  static debugHash() { return _debugHash; }

  inspect() {
    return `<${this.name}>`;
  }
}
