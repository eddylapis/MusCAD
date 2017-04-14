import BaseElement from './base-element';

import {CyclicDblLinkedListContainer} from './linked-list';

export default class Loop extends BaseElement {
  constructor() {
    super();

    //upward
    this._lf = null;

    //diagonal
    this._next = null;
    this._prev = null;

    //downward
    this._eulist = new CyclicDblLinkedListContainer(this);
  }

  get _body() { return this._lf._fb; }

  _setParent(p) { this._lf = p; }

  _appendEdgeUse(eu) { return this._eulist.append(eu); }
  _insertAfter(ref, eu) { return this._eulist.insertAfter(ref, eu); }
  _insertBefore(ref, eu) { return this._eulist.insertBefore(ref, eu); }

  //tmp
  get vertices() { return [...this._eulist].map(eu => eu._euvu._vuv) ; }
  //end tmp

  inspect() {
    let str = [...this._eulist].map(s => s.name).join(',');
    return `<${this.name}: [${str}]>`;
  }
}
