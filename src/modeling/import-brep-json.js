import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
  Reference, Instance,
} from './element';

import * as Op from './euler';

export default function importJSON(Application, json) {
  let definitions = {};
  let jsonDefinitions = json.definitions;
  let jsonMaterials = json.materials;
  let materials = jsonMaterials;
  let preCalculated = !!json['_calculated'];

  // Load Definition one by one
  for (let did in jsonDefinitions) {
    definitions[did] = buildDefinition(did, jsonDefinitions[did]);
  }

  // Insert all instances
  definitions[json._rootID]._buildRootInstance();
  for (let did in jsonDefinitions) {
    let definition = definitions[did];
    jsonDefinitions[did].subInstances.forEach(ins => {
      let subDefinition = definitions[ins.definitionID];
      let trans = ins.transformationMatrix;
      let materialID = ins.materialID;

      definition._addSubInstance(subDefinition, trans, materialID);
    });
  }

  Application.definitions = definitions;
  Application.materials = materials;

  for (let did in Application.definitions) Application.definitions[did]._updateReferences();

  console.log('Model Loaded');
}

function buildDefinition(did, json) {
  let _vertexStore = {},
      _edgeStore = {},
      _faceStore = {};

  let definition = new Definition();
  definition.id = did;

  // Vertices
  json.vertices.forEach(vJson => {
    let {v} = Op._mv();
    v.id = vJson.id;
    v.position = new Float32Array(vJson.position);

    _vertexStore[v.id] = v;
  });

  // Bodies
  json.bodies.forEach(bJson => {
    let body = definition._addBody();
    body.id = bJson.id;

    //Edges
    bJson.edges.forEach(eJson => {
      let v1 = _vertexStore[eJson.startID];
      let v2 = _vertexStore[eJson.endID];

      let {e1} = Op._me(body, v1, v2);
      e1.id = eJson.id;
      e1.soft = eJson.soft;

      _edgeStore[e1.id] = e1;
    });

    //Faces
    bJson.faces.forEach(fJson => {
      let outerEdges = fJson.outerLoopE.map(eid => _edgeStore[eid]);

      let {f1} = Op.mf(outerEdges);
      fJson.innerLoopsE.forEach(loope => {
        Op._mil(f1, loope.map(eid => _edgeStore[eid]));
      });

      f1.id = fJson.id;
      f1.materialID = fJson.materialID;
      f1.backMaterialID = fJson.backMaterialID;
      _faceStore[f1.id] = f1;
    });
  });

  // tmp
  definition.faces = Object.keys(_faceStore).map(k => _faceStore[k]);
  definition.edges = Object.keys(_edgeStore).map(k => _edgeStore[k]);
  definition.vertices = {length: 1234};
  // end tmp

  return definition;
}
