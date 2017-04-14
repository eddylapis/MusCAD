import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

export default function me(v1, v2) {
  let vu1 = v1._addVertexUse();
  let vu2 = v2._addVertexUse();

  let e1 = Edge.buildWithEU();
  let eu1 = e1._eeu;
  let eu2 = eu1._mate;

  let b1 = v1._body;

  EdgeUse._setEUVU(eu1, vu1);
  EdgeUse._setEUVU(eu2, vu2);
  EdgeUse._setEUB(eu1, b1);
  EdgeUse._setEUB(eu2, b1);

  return {vu1, vu2, e1, eu1, eu2};
}
