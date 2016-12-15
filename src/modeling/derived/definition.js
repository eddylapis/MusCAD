import Geom3 from 'geom3';

import mapVertexIndex from '../helpers/map-vertex-index';
import getDataViewVertices from '../helpers/get-dataview-vertices';

let derivedDefinitions = {};

function updateDerivedDefinition(definition) {
  derivedDefinitions[definition.id] = genDerivedDefinition(definition);
}

function genDerivedDefinition(definition) {
  return {
    vIdxInDef: mapVertexIndex(definition),
    vBuffer: getDataViewVertices(definition),
  };
}

module.exports = {
  derivedDefinitions,
  updateDerivedDefinition,
  genDerivedDefinition,
};
