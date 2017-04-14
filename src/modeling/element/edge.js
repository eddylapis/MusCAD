import BaseElement from './base-element';

import EdgeUse from './edge-use';

export default class Edge extends BaseElement {
  constructor() {
    super();

    this._eeu = null;
  }

  get _body() { return this._eeu._body; }
  get _start() { return this._eeu._euvu._vuv; }
  get _end() { return this._eeu._mate._euvu._vuv; }

  get start() { return this._start; }
  get end() { return this._end; }

  commonVertex(other) { return commonVertex(this, other); }
  otherVertex(v) { return otherVertex(this, v); }

  _getEUbyV(v) { return (this._eeu._euvu._vuv === v) ? this._eeu : this._eeu._mate; }

  /* Adjacency */
  *_adjGenE() {
    for (let e of this._start._adjGenE()) { if (e !== this) yield e; }
    for (let e of this._end._adjGenE()) { if (e !== this) yield e; }
  }
  *_adjGenF() { yield* this._eeu._adjGenF(); yield* this._eeu._mate._adjGenF(); }

  static buildWithEU() {
    let e = new Edge();
    let eu1 = new EdgeUse();
    let eu2 = new EdgeUse();

    EdgeUse._setMate(eu1, eu2);

    eu1._eue = e;
    eu2._eue = e;

    e._eeu = eu1;

    return e;
  }

  inspect() {
    return `<${this.name}: ${this._start.name} - ${this._end.name}>`;
  }
}

function commonVertex(e1, e2) {
  if (e1._start === e2._start || e1._start === e2._end) return e1._start;
  if (e1._end === e2._start || e1._end === e2._end) return e1._end;

  throw(`${e1.name} not connected to ${e2.name}`);
}

function otherVertex(e, v) {
  if (e._start === v) return e._end;
  if (e._end === v) return e._start;

  throw(`${e.name} not connected to ${v.name}`);
}
