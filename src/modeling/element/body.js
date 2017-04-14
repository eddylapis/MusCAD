import BaseElement from './base-element';

import {CyclicDblLinkedListContainer} from './linked-list';

import Face from './face';

export default class Body extends BaseElement {
  constructor() {
    super();

    //upward
    this._bm = null;

    //diagonal
    this._next = null;
    this._prev = null;

    //downward
    /* Case Solid */
    this._flist = new CyclicDblLinkedListContainer(this);

    /* Case WireFrame */
    this._beu = null;
  }

  _setParent(p) { this._bm = p; }

  _addFaceWithLoop() { let f = new Face(); f._addLoop(); return this._flist.append(f); }

  inspect() {
    let str = [...this._flist].map(s => s.name).join(',');
    return `<${this.name}: faces -> [${str}]; eu -> ${this._beu.name}>`;
  }
}
