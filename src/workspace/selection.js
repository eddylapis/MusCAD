import {
  genRenderingEdgeSelObj,
  genRenderingFaceSelObj,
} from '../renderer/gen-rendering-sel';

let selectedEdges = {};
let selectedFaces = {};
let editingContext = null;

function addFace(face) {
  if (!face) return;
  selectedFaces[face.id] = face;
}

function addEdge(edge) {
  if (!edge) return;
  selectedEdges[edge.id] = edge;
}

function clearEdge() {
  for (let k in selectedEdges) { delete selectedEdges[k]; }
}

function clearFace() {
  for (let k in selectedFaces) { delete selectedFaces[k]; }
}

function setEditing(def) {
  editingContext = def;
}

function invalidateSelections() {
  genRenderingEdgeSelObj(selectedEdges);
  genRenderingFaceSelObj(selectedFaces);
}

module.exports = {
  invalidateSelections,
  selectedEdges,
  selectedFaces,
  editingContext,
  clearEdge,
  clearFace,
  addEdge,
  addFace,
};
