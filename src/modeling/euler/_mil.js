import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

export default function _mil(f1, edges) {
  let first = edges[0];
  let last = edges[edges.length-1];

  let currentV = first.commonVertex(last);

  let euList = [];
  for (let e of edges) {
    euList.push(e._getEUbyV(currentV));
    currentV = e.otherVertex(currentV);
  }

  euList = euList.map(eu => (eu._isFree) ? eu : eu._makeRadial());

  let il = f1._addLoop();

  euList.forEach(eu => il._appendEdgeUse(eu));

  return {il};
}
