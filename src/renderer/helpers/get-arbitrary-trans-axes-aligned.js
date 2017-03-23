import Geom3 from 'geom3';

export default function getArbitraryTransAxesAligned(out, z) {
  let x = [],
      y = [];

  Geom3.cross(x, z, Geom3.Z_AXIS);
  if (Geom3.isZeroVec(x)) Geom3.vec3.copy(x, Geom3.X_AXIS);
  Geom3.cross(y, z, x);

  out[0]  = x[0];
  out[1]  = y[0];
  out[2]  = z[0];
  out[3]  = 0;

  out[4]  = x[1];
  out[5]  = y[1];
  out[6]  = z[1];
  out[7]  = 0;

  out[8]  = x[2];
  out[9]  = y[2];
  out[10] = z[2];
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}
