import Geom3 from 'geom3';

import getPolyNormal from '../helpers/get-poly-normal';
import getArbitraryTransAxesAligned from '../helpers/get-arbitrary-trans-axes-aligned';

import earcut from 'earcut';

let derivedFaces = {};

function updateDerivedFace(idxTable, face) {
  derivedFaces[face.id] = genDerivedFace(idxTable, face);
}

function genDerivedFace(idxTable, face) {
  let arrOuterLoop  = face.outerLoop,
    arrInnerLoops = face.innerLoops; // loop: [v1,v2...]

  let loops = [
    ...arrOuterLoop,
    ...arrInnerLoops.reduce((m,e) => m.concat(e), []),
  ];

  let {
    indices: vLoopIndex,
    uvTrans: uvTrans,
    normal: normal,
    backNormal: backNormal,
  } = _earcutFix(
    loops.map(v => v.position),
    _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops)
  );

  let localIndices = vLoopIndex.map(i => loops[i]).map(v => idxTable[v.id]);

  return {localIndices, uvTrans, normal, backNormal};

  function _getInnerLoopStartingIdx(arrOuterLoop, arrInnerLoops) {
    let indices = arrInnerLoops.map(l => l.length);
    let startLen = arrOuterLoop.length;
    indices.unshift(0)
    indices = indices.map(i => i + startLen);
    indices.pop()
    return indices;
  }

  function _earcutFix(arrPts, holeInd){
    let trans2D = Geom3.mat4.create();
    let newZ = getPolyNormal(Geom3.vec3.create(), arrPts);
    getArbitraryTransAxesAligned(trans2D, newZ);

    let arr2d = [];
    var vecTmp = Geom3.vec3.create();
    arrPts.forEach(function(pt) {
      Geom3.vec3.transformMat4(vecTmp, pt, trans2D);
      arr2d.push(vecTmp[0]);
      arr2d.push(vecTmp[1]);
    });

    let indices = [];
    try {
      indices = earcut(arr2d, holeInd);
    } catch(e) {
      console.log(e);
    }

    return {
      indices: indices,
      normal: Geom3.vec3.copy(Geom3.vec3.create(), newZ),
      backNormal: Geom3.vec3.negate(Geom3.vec3.create(), newZ),
      uvTrans: trans2D,
    };
  }
}

module.exports = {
  derivedFaces,
  updateDerivedFace,
  genDerivedFace,
}
