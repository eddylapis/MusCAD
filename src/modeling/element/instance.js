import { Application } from '../../initializer';

import flattenDeep from 'lodash/fp/flattendeep';

import {mat4} from 'geom3';

export default class Instance {
  constructor(parentDefinitionID, definitionID, transformation, materialID) {
    this.definitionID = definitionID;
    this.parentDefinitionID = parentDefinitionID;
    this.materialID = materialID;
    this.transformation = transformation;
  }

  get parent() {
    if (this.parentDefinitionID) {
      return Application.definitions[this.parentDefinitionID];
    } else {
      return null;
    }
  }

  _getReferences() {
    let res = [];
    let acc = [new InstanceChain([this])];
    while (acc.length) {
      acc = flattenDeep(acc.map(chain => {
        let parent = chain.parentOfFirst;
        if (parent) {
          return parent._instances.map(p => chain.chainParent(p));
        } else {
          res.push(chain);
          return [];
        }
      }));
    }

    return res.map(chain => {
      let transformations = chain.instances.map(i => i.transformation);
      let materialIDs = chain.instances.map(i => i.materialID);

      let absTrans = transformations.reduce((e, m) => mat4.mul([], e, m), mat4.create());
      let materialID = materialIDs.reduce((e, m) => (e) ? e : m);
      return {
        absTrans: new Float32Array(absTrans),
        materialID: materialID,
      };
    });
  }
}

class InstanceChain {
  constructor(arr) { this.instances = arr; }
  chainParent(parent) { return new InstanceChain([parent, ...this.instances]); }
  get parentOfFirst() { return this.instances[0].parent; }
}
