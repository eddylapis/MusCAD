import Geom3 from 'geom3';

import mapValues from 'lodash/fp/mapvalues';

//TODO: move to Geom3

export default function getPolyNormal(out, pts) {
  let len    = pts.length,
      v1     = Geom3.sub([], pts[0], pts[len-1]),
      v2     = [],
      normal = [],
      i;

  for (i=0; i<len-1; i++) {
    Geom3.sub(v2, pts[i+1], pts[i]);
    Geom3.cross(normal, v1, v2);
    if (!Geom3.isZeroVec(normal)) break;
  }

  return Geom3.norm(out, normal);
}
