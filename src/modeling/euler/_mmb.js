import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

export default function _mmb() {
  let m = new Definition();
  let b = m._addBody();

  return {m, b};
}
