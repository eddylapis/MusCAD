import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

export default function mf(edges) {
  let first = edges[0];
  let last = edges[edges.length-1];

  let currentV = first.commonVertex(last);

  let euList = [];
  for (let e of edges) {
    euList.push(e._getEUbyV(currentV));
    currentV = e.otherVertex(currentV);
  }

  euList = euList.map(eu => (eu._isFree) ? eu : eu._makeRadial());

  let b1 = edges[0]._body;
  let f1 = b1._addFaceWithLoop();
  let l1 = f1._outerLoop;

  euList.forEach(eu => l1._appendEdgeUse(eu));

  return {f1, l1};
}
