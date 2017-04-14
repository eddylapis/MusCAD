import groupBy from 'lodash/fp/groupBy';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';

import Part from './part';
import PartPreCalculated from './part-pre-calculated';
import Material from './material';
import SolidLine from './solid-line';
import getInstanceMats from './helpers/get-instance-mats';

class Container {
  constructor() {
    this.parts = {};
    this.solidLines = {};
    this.materials = {};
  }

  updateMaterial(materialData) {
    this.materials[materialData.id] = new Material(materialData);
  }

  updateDefinition(definition) {
    let transArray = getInstanceMats(definition);

    let front = flow(
      filter(f => f.material),
      groupBy(f => f.material.id)
    )(definition.faces);

    for (let mid in front) {
      let material = this.materials[mid];
      let faces = front[mid];

      _make_part(this.parts, faces, transArray, definition, material, 'front');
    }

    let back = flow(
      filter(f => f.backMaterial),
      groupBy(f => f.backMaterial.id)
    )(definition.faces);

    for (let mid in back) {
      let material = this.materials[mid];
      let faces = back[mid];

      _make_part(this.parts, faces, transArray, definition, material, 'back');
    }

    let refGroup = groupBy(r => r.materialID)(definition._references);
    let facesNoMaterial = filter(f => !f.material)(definition.faces);
    let facesNoBackMaterial = filter(f => !f.backMaterial)(definition.faces);

    for (let mid in refGroup) {
      let materialFront = this.materials[mid] || this.materials['__default_front'];
      let materialBack = this.materials[mid] || this.materials['__default_back'];
      let refs = refGroup[mid];
      let refTransArray = getInstanceMats({_references: refs});

      _make_part(this.parts, facesNoMaterial, refTransArray, definition, materialFront, 'front');
      _make_part(this.parts, facesNoBackMaterial, refTransArray, definition, materialBack, 'back');
    }

    let edges = definition.edges;
    let solidLine = new SolidLine(transArray, edges);

    this.solidLines[_make_id(definition, '', '')] = solidLine;
  }
}

function _make_id(defi, mat, side) { return `${defi.id}-${mat.id}-${side}`; }
function _make_part(storage, faces, transArray, definition, material, side) {
  storage[_make_id(definition, material, side)] = new Part(transArray, material, faces, side);
  //storage[_make_id(definition, material, side)] = new PartPreCalculated(transArray, material, faces, side);
}

let instance = new Container();
export default instance;
