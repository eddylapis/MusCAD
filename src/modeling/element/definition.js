import BaseElement from './base-element';

import {CyclicDblLinkedListContainer} from './linked-list';

import Body from './body';

import {mat4} from 'geom3';

import Instance from './instance';
import Reference from './reference';

import flatten from 'lodash/fp/flatten';

export default class Definition extends BaseElement {
  constructor() {
    super();

    this._blist = new CyclicDblLinkedListContainer(this);

    this._references = [];
    this._subInstances = [];
    this._instances = [];
  }

  get _mb() { return this._blist.head; }

  _addBody() { return this._blist.append(new Body()); }

  /* Modeling Methods */
  _addSubInstance(subDefinition, transformation, materialID=null) {
    let instance = new Instance(this.id, subDefinition.id, transformation, materialID);
    this._subInstances.push(instance);
    subDefinition._instances.push(instance);
  }

  _buildRootInstance() {
    let rootInstance = new Instance(null, this.id, mat4.create());
    this._instances.push(rootInstance);
  }

  _updateReferences() {
    this._references = flatten(this._instances.map(ins => ins._getReferences()));
  }

  inspect() {
    let str = [...this._blist].map(s => s.name).join(',');
    return `<${this.name}: [${str}]>`;
  }
}
