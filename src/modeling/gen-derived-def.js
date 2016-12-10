import _ from 'lodash';

let definitionDerivedObjects = {};

function genDerivedDef(definition) {
  let pts = _.values(definition.vertices).map(v => v.position);
  let bb;

  if (pts.length !== 0) {
    bb = BoundingBox.fromPts(pts);
  }

  let newDerivedObj = {
    boundingBox: bb,
  };

  definitionDerivedObjects[definition.id] = newDerivedObj;
}

export class BoundingBox {
  constructor(min_pt, max_pt) {
    let minx = min_pt[0],
        miny = min_pt[1],
        minz = min_pt[2],
        maxx = max_pt[0],
        maxy = max_pt[1],
        maxz = max_pt[2];

        this.minx = minx;
        this.miny = miny;
        this.minz = minz;
        this.maxx = maxx;
        this.maxy = maxy;
        this.maxz = maxz;

        this.p1 = [minx, miny, minz];
        this.p2 = [maxx, miny, minz];
        this.p3 = [maxx, maxy, minz];
        this.p4 = [minx, maxy, minz];
        this.p5 = [minx, miny, maxz];
        this.p6 = [maxx, miny, maxz];
        this.p7 = [maxx, maxy, maxz];
        this.p8 = [minx, maxy, maxz];

        //fTop = [p5,p6,p7,p8],
        //fBtm = [p1,p2,p3,p4],
        //fFront = [p1,p2,p6,p5],
        //fBack = [p3,p4,p8,p7],
        //fLeft = [p4,p1,p5,p8],
        //fRight = [p2,p3,p7,p6],
        //e12 = [p1, p2],
        //e26 = [p2, p6],
        //e65 = [p6, p5],
        //e51 = [p5, p1],
        //e34 = [p3, p4],
        //e48 = [p4, p8],
        //e87 = [p8, p7],
        //e73 = [p7, p3],
        //e14 = [p1, p4],
        //e23 = [p2, p3],
        //e67 = [p6, p7],
        //e58 = [p5, p8];
  }

  get corners() {
    return [
      this.p1, this.p2, this.p3, this.p4,
      this.p5, this.p6, this.p7, this.p8,
    ];
  }

  get center() {
    return [
      (this.minx + this.maxx) / 2.0,
      (this.miny + this.maxy) / 2.0,
      (this.minz + this.maxz) / 2.0,
    ];
  }

  static fromPts(pts) {
    let [minx, miny, minz] = [Infinity, Infinity, Infinity];
    let [maxx, maxy, maxz] = [-Infinity, -Infinity, -Infinity];

    for (let x,y,z,i=0; i<pts.length; ++i) {
      [x,y,z] = [pts[i][0], pts[i][1], pts[i][2]];

      if (minx > x) minx = x;
      if (miny > y) miny = y;
      if (minz > z) minz = z;
      if (maxx < x) maxx = x;
      if (maxy < y) maxy = y;
      if (maxz < z) maxz = z;
    }

    return new BoundingBox([minx, miny, minz], [maxx, maxy, maxz]);
  }
}

module.exports = {
  definitionDerivedObjects,
  genDerivedDef,
  BoundingBox,
};
