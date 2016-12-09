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

    let pickedEdge = _pickEdges(this.workspace, mouseX, mouseY)[0];
    if (event.ctrlKey) {
      selection.addEdge(pickedEdge);
      selection.invalidateEdges();
    } else {
      selection.clearEdge();
      selection.addEdge(pickedEdge);
      selection.invalidateEdges();
    }
  }
}

function _pickEdges(workspace, mouseX, mouseY) {
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

  function _getViewPt(x,y,z) {
    return Geom3.world2view(
      [],
      workspace.camera.matProjection,
      workspace.camera.matView,
      workspace.displayWidth,
      workspace.displayHeight,
      [x,y,z]
    );
  }
}
