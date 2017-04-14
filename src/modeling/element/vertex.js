import BaseElement from './base-element';

import VertexUse from './vertex-use';

import {CyclicDblLinkedListContainer} from './linked-list';

export default class Vertex extends BaseElement {
  constructor() {
    super();

    this._vulist = new CyclicDblLinkedListContainer(this);
  }

  get _vvu() { return this._vulist.head; }
  get _body() { return this._vvu._vueu._body; }

  _addVertexUse() { return this._vulist.append(new VertexUse()); }
  _removeVertexUse(vu) { return this._vulist.remove(vu); }

  /* Adjacency */
  *_adjGenV() { yield* this._vulist._genMap(vu => vu._vueu._mate._euvu._vuv); }
  *_adjGenE() { yield* this._vulist._genMap(vu => vu._vueu._eue); }
  *_adjGenF() {
    let visited = {};
    for (let edge of this._adjGenE()) {
      for (let face of edge._adjGenF()) {
        if (!visited[face.__objid__]) yield face;
        visited[face.__objid__] = true;
      }
    }
  }

  inspect() {
    return `<${this.name}: [${[...this._vulist].map(strVU).join(', ')}]>`;
  }
}

function strVU(vu) { return `${vu.name} - ${vu._vueu._eue.name}`;}
