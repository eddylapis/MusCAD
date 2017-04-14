import {
  Vertex, VertexUse, Edge, EdgeUse, Loop, Face, Body, Definition,
} from '../element';

/* v1--------e1--------v3 */
/* v1---e1---v2---e2---v3 */

export default function semv(e1) {
  let v1        = e1._start,
      v3        = e1._end,
      v2        = new Vertex(),
      e2        = new Edge(),
      eu13      = e1._eeu,
      eu31      = e1._eeu._mate,
      vuOld     = eu31._euvu,
      vuv2e1    = v2._addVertexUse(),
      vuv2e2    = v2._addVertexUse(),
      vuv3e2    = v3._addVertexUse(),
      e2radial1 = [],
      e2radial2 = [];

  for (let eu of eu13._radialGen()) {
    let mate = eu._mate;

    let eu23 = new EdgeUse();
    let eu32 = new EdgeUse();
    EdgeUse._setMate(eu23, eu32);
    eu23._eue = e2;
    eu32._eue = e2;
    eu23._euvu = vuv2e2;
    eu32._euvu = vuv3e2;
    eu23._eub = eu._eub;
    eu32._eub = eu._eub;

    // eu start-end
    if (eu._eul) eu._eul._insertAfter(eu, eu23);

    // eu end-start
    if (mate._eul) mate._eul._insertBefore(mate, eu32);

    e2radial1.push(eu23);
    e2radial2.push(eu32);

    // e1 ends at v2
    mate._euvu = vuv2e1;
  }

  e2radial1.forEach((eu, i, a) => eu._radial = a[(i+1) % a.length]);
  e2radial2.forEach((eu, i, a) => eu._radial = a[(i+1) % a.length]);

  vuv2e1._vueu = e1._eeu._mate;
  vuv2e2._vueu = e2radial1[0];
  vuv3e2._vueu = e2radial2[0];
  e2._eeu = e2radial1[0];

  v3._removeVertexUse(vuOld);

  return {v2, e2};
}
