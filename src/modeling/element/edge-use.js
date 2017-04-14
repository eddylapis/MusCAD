import BaseElement from './base-element';

import { _genMapCond, _genMap, _genStop } from './generator-util';

export default class EdgeUse extends BaseElement {
  constructor() {
    super();

    this._mate = null;

    //upward
    this._eub = null;

    /* Case Solid */
    this._eul = null;

    //diagonal
    /* Case Solid */
    this._next = null;
    this._prev = null;

    this._radial = this;

    //downward
    this._eue = null;
    this._euvu = null;
  }

  _setParent(p) { this._eul = p; }

  get _body() { return (this._eul && this._eul._body) || this._eub;}
  get _isFree() { return !this._next; }
  _makeRadial() {
    let vu1 = this._euvu;
    let vu2 = this._mate._euvu;

    let radial1 = new EdgeUse();
    let radial2 = new EdgeUse();

    EdgeUse._setMate(radial1, radial2);

    radial1._euvu = vu1;
    radial2._euvu = vu2;
    radial1._eue = this._eue;
    radial2._eue = this._eue;
    radial1._eub = this._body;
    radial2._eub = this._body;

    radial1._radial = this._radial;
    this._radial = radial1;

    radial2._radial = this._mate._radial;
    this._mate._radial = radial2;

    return radial1;
  }

  *_adjGenF() {
    yield* _genMapCond(
      this._radialGen.bind(this),
      eu => eu._eul && eu._eul._lf,
      f => f,
    );
  }

  *_radialGen() {
    let cur = this;
    do { yield cur; cur = cur._radial; } while (this !== cur);
    return {done: true};
  }

  static _setMate(eu1, eu2) { eu1._mate = eu2; eu2._mate = eu1; }
  static _setEUVU(eu, vu) { eu._euvu = vu; vu._vueu = eu; }
  static _setEUB(eu, b) { eu._eub = b; b._beu = eu; }

  inspect() {
    let str = [...this._radialGen()]
      .map(eu => `${eu.name} - ${(eu._isFree) ? '<Free>' : eu._eul.name}`)
      .join(', ');
    return `<${this.name}: E - ${this._eue.name}; radials: [${str}]>`;
  }
}
