import BaseElement from './base-element';

export default class VertexUse extends BaseElement {
  constructor() {
    super();
    //downward
    this._vuv = null;

    //diagonal
    this._next = null;
    this._prev = null;

    //upward
    this._vueu = null;
  }

  _setParent(p) { this._vuv = p; }
}
