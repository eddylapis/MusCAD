import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

export default function mbevv() {
  let m1 = new Definition();

  let b1 = m1._addBody();

  let v1 = new Vertex();
  let vu1 = v1._addVertexUse();

  let v2 = new Vertex();
  let vu2 = v2._addVertexUse();

  let e1 = Edge.buildWithEU();
  let eu1 = e1._eeu;
  let eu2 = eu1._mate;

  EdgeUse._setEUVU(eu1, vu1);
  EdgeUse._setEUVU(eu2, vu2);
  EdgeUse._setEUB(eu1, b1);
  EdgeUse._setEUB(eu2, b1);

  return {m1, b1, v1, vu1, v2, vu2, e1, eu1, eu2};
}
