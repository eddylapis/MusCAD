export default function importJSON(json) {
  let definitions = {};
  let jsonDefinitions = json.definitions;
  let jsonMaterials = json.materials;
  let materials = jsonMaterials;

  // Load Definition one by one
  for (let definitionID in jsonDefinitions) {
    let jsonEdges = jsonDefinitions[definitionID]['edges'],
      jsonVertices = jsonDefinitions[definitionID]['vertices'],
      jsonFaces = jsonDefinitions[definitionID]['faces'],
      jsonReferences = jsonDefinitions[definitionID]['references'];

    // Load all vertices
    let vertices = {};
    for (let vertexID in jsonVertices) {
      let jsonVertex = jsonVertices[vertexID];
      vertices[vertexID] = {
        id: vertexID,
        position: new Float32Array(jsonVertex.p3d),
      };
    }

    let toVertexPointer = (i) => vertices[i];

    // Load all edges
    let edges = {};
    for (let edgeID in jsonEdges) {
      let jsonEdge = jsonEdges[edgeID];
      edges[edgeID] = {
        id: edgeID,
        definitionID: definitionID,
        start: toVertexPointer(jsonEdge.start),
        end: toVertexPointer(jsonEdge.end),
      };
    }

    // Load all faces
    let faces = {};
    for (let faceID in jsonFaces) {
      let jsonFace = jsonFaces[faceID];
      faces[faceID] = {
        id: faceID,
        definitionID: definitionID,
        outerLoop: jsonFace.outerLoop.map(toVertexPointer),
        innerLoops: jsonFace.innerLoops.map(l => l.map(toVertexPointer)),
        material: jsonMaterials[jsonFace.materialID],
        backMaterial: jsonMaterials[jsonFace.backMaterialID],
      };
    }

    // Load all references
    let references = {};
    for (let refID in jsonReferences) {
      let jsonRef = jsonReferences[refID];

      references[refID] = {
        id: refID,
        definitionID: definitionID,
        absTrans: new Float32Array(jsonRef.absTrans),
        material: jsonMaterials[jsonRef.materialID],
      };
    }

    definitions[definitionID] = {
      id: definitionID,
      vertices: vertices,
      edges: edges,
      faces: faces,
      references: references,
    }
  }

  return {definitions, materials};
}
