import { Application } from '../../initializer';

import BaseElement from './base-element';

import {CyclicDblLinkedListContainer} from './linked-list';

import Loop from './loop';

export default class Face extends BaseElement {
  constructor() {
    super();

    // upward
    this._fb = null;

    //diagonal
    this._next = null;
    this._prev = null;

    //downward
    this._llist = new CyclicDblLinkedListContainer(this);
  }

  _setParent(p) { this._fb = p; }

  _addLoop() { return this._llist.append(new Loop()); }

  get _fl() { return this._llist.head; }

  /* Queries */
  get _outerLoop() { return this._fl; }
  get outerLoop() { return this._outerLoop; }

  //tmp
  get innerLoops() {
    let loops = [...this._llist];
    loops.shift();
    return loops;
  }
  //endtmp

  /* Modeling Methods */
  get material() { return this.materialID && Application.materials[this.materialID]; }
  get backMaterial() { return this.backMaterialID && Application.materials[this.backMaterialID]; }

  inspect() {
    let str = [...this._llist].map(s => s.name).join(',');
    return `<${this.name}: [${str}]>`;
  }
}
