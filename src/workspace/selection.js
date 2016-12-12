import {
  genRenderingEdgeSelObj,
  genRenderingFaceSelObj,
} from '../renderer/gen-rendering-sel';

let selectedEdges = {};
let selectedFaces = {};
let selectedRefs = {};
let editingContext = null;

function addReference(ref) {
  if (!ref) return;
  selectedRefs[ref.id] = ref;
}

function addFace(face) {
  if (!face) return;
  selectedFaces[face.id] = face;
}

function addEdge(edge) {
  if (!edge) return;
  selectedEdges[edge.id] = edge;
}

function clearRef() {
  for (let k in selectedRefs) { delete selectedRefs[k]; }
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
  genRenderingEdgeSelObj(selectedEdges, selectedRefs);
  genRenderingFaceSelObj(selectedFaces);
}

module.exports = {
  invalidateSelections,
  selectedEdges,
  selectedFaces,
  selectedRefs,
  editingContext,
  clearEdge,
  clearFace,
  clearRef,
  addEdge,
  addFace,
  addReference,
};
