import { genRenderingEdgeSelObj } from '../renderer/gen-rendering-sel';

let selectedEdges = {};
let editingContext = null;

function addEdge(edge) {
  if (!edge) return;
  selectedEdges[edge.id] = edge;
}

function clearEdge() {
  for (let k in selectedEdges) { delete selectedEdges[k]; }
}

function setEditing(def) {
  editingContext = def;
}

function invalidateEdges() {
  genRenderingEdgeSelObj(selectedEdges);
}

module.exports = {
  clearEdge,
  invalidateEdges,
  selectedEdges,
  editingContext,
  addEdge,
};
