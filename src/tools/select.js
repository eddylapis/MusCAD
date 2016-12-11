import selection from '../workspace/selection';

import Geom3 from 'geom3';

import _ from 'lodash';

export default class SelectTool {
  constructor(workspace) {
    this.camera = workspace.camera;
    this.displayWidth = workspace.displayWidth;
    this.displayHeight = workspace.displayHeight;
    this.workspace = workspace;

    //_.values(_.values(this.workspace.definitions)[0].edges).forEach(e => {
    //  selection.addEdge(e);
    //});
  }

  activate() {
  }

  click(event) {
    let mouseX = event.offsetX,
        mouseY = event.offsetY;

    let pickedFace = _pickFaces(this.workspace, mouseX, mouseY)[0];
    let pickedEdge = _pickEdges(this.workspace, mouseX, mouseY)[0];

    if (!event.ctrlKey) {
      selection.clearEdge();
      selection.clearFace();
    }

    //if (false && pickedEdge) {
    if (pickedEdge) {
      selection.addEdge(pickedEdge);
    } else if (pickedFace) {
      selection.addFace(pickedFace);
    }

    selection.invalidateSelections();
  }
}

function _pickingRay(workspace, mouseX, mouseY) {
  let pt1 = Geom3.view2world(
    [],
    workspace.camera.matProjection,
    workspace.camera.matView,
    workspace.displayWidth,
    workspace.displayHeight,
    [mouseX, mouseY, 0.99]
  );

  let pt2 = Geom3.view2world(
    [],
    workspace.camera.matProjection,
    workspace.camera.matView,
    workspace.displayWidth,
    workspace.displayHeight,
    [mouseX, mouseY, 0.97]
  );
  return [pt1, Geom3.vec3.sub([], pt2, pt1)];
}

function _pickFaces(workspace, mouseX, mouseY) {
  let _getViewPt = __getViewPt.bind(workspace);
  let pickedFacesList = {};
  let [x,y] = [mouseX, mouseY];
  _.values(workspace.definitions).forEach(def => {
    _.values(def.references).forEach(ref => {
      _.values(def.faces).forEach(face => {
        let pts = face.outerLoop.map(v => {
          return _getViewPt(...Geom3.vec3.transformMat4([], v.position, ref.absTrans));
        });

        // TODO: take innerLoops into account later...
        if (_ptInPoly2D(x, y, pts)) {
          pickedFacesList[face.id] = {
            face: face,
          }
        }
      });
    });
  });

  if (Object.keys(pickedFacesList) !== 0) {
    let [rayPt, rayVec] = _pickingRay(workspace, mouseX, mouseY);
    _.values(pickedFacesList).forEach(e => {
      let normal = _polyNormal([], e.face.outerLoop.map(v => v.position));
      let intersect3D = Geom3.intersectLinePlane([],
        rayPt, rayVec, e.face.outerLoop[0].position, normal);

      e.z = _getViewPt(...intersect3D)[2];
    });
  }

  return _.sortBy(pickedFacesList, 'z').map(o => o.face);

  function _polyNormal(out, poly) {
    // TODO: move to Geom3
    let vec1 = [], vec2 = [], norm = [];
    Geom3.vec3.sub(vec1, poly[1], poly[0]);
    for (let i=1;i<poly.length-1;++i) {
      Geom3.vec3.sub(vec2, poly[i+1], poly[i]);
      Geom3.cross(norm, vec1, vec2);
      if (!Geom3.isZeroVec(norm)) break;
    }

    return Geom3.vec3.copy(out, norm);
  }

  function _ptInPoly2D(x, y, poly) {
    // TODO: move to Geom3
    let num = poly.length,
        i   = 0,
        j   = num - 1,
        c   = false;

    for (let i=0; i<num; i++) {
      if  (
        (poly[i][1] > y) != (poly[j][1] > y) &&
          (x < (poly[j][0] - poly[i][0]) * (y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
      ) {
        c = !c;
      }

      j = i
    }

    return c
  }
}

function _pickEdges(workspace, mouseX, mouseY) {
  let _getViewPt = __getViewPt.bind(workspace);
  let pickedEdgesList = {};
  _.values(workspace.definitions).forEach((def) => {
    _.values(def.references).forEach(ref => {
      _.values(def.edges).forEach(edge => {
        let vpt1 = _getViewPt(...Geom3.vec3.transformMat4([], edge.start.position, ref.absTrans));
        let vpt2 = _getViewPt(...Geom3.vec3.transformMat4([], edge.end.position, ref.absTrans));

        let distPx = Geom3.distBetweenLines(
          [mouseX, mouseY, 0], [0,0,1],
          vpt1, Geom3.vec3.sub([], vpt2, vpt1)
        );

        if (distPx < 5) {
          let edgeLenPx = Geom3.distBetweenPoints(vpt2, vpt1);
          if (
            Geom3.distBetweenPoints([mouseX, mouseY, vpt1[2]], vpt1) < edgeLenPx &&
              Geom3.distBetweenPoints([mouseX, mouseY, vpt2[2]], vpt2) < edgeLenPx
          ) {
            pickedEdgesList[edge.id] = {
              edge: edge,
              z: _.min([vpt1[2], vpt2[2]])
            }
          }
        }
      });
    });
  });

  return _.sortBy(pickedEdgesList, 'z').map(o => o.edge);
}

function __getViewPt(x,y,z) {
  return Geom3.world2view(
    [],
    this.camera.matProjection,
    this.camera.matView,
    this.displayWidth,
    this.displayHeight,
    [x,y,z]
  );
}
