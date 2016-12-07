import { genRenderingEdgeSelObj } from '../renderer/gen-rendering-sel';

let selectedEdges = {};
let editingContext = null;

function addEdge(edge) {
  if (!edge) return;
  selectedEdges[edge.id] = edge;

  genRenderingEdgeSelObj(selectedEdges);
}

function setEditing(def) {
  editingContext = def;
}

module.exports = {
  selectedEdges,
  editingContext,
  addEdge,
};
