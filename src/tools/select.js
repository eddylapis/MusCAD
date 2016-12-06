import Geom3 from 'geom3';

import _ from 'lodash';

export default class SelectTool {
  constructor(workspace) {
    this.camera = workspace.camera;
    this.displayWidth = workspace.displayWidth;
    this.displayHeight = workspace.displayHeight;
    this.workspace = workspace;
  }

  activate() {
  }

  _getViewPt(x,y,z) {
    return Geom3.world2view(
      [],
      this.camera.matProjection,
      this.camera.matView,
      this.displayWidth,
      this.displayHeight,
      [x,y,z]
    );
  }

  mousemove(event) {
    let mouseX = event.offsetX,
        mouseY = event.offsetY;

    let pickedEdges = [];

    _.values(this.workspace.definitions).forEach((def) => {
      _.values(def.references).forEach(ref => {
        _.values(def.edges).forEach(edge => {
          let vpt1 = this._getViewPt(...Geom3.vec3.transformMat4([], edge.start.position, ref.absTrans));
          let vpt2 = this._getViewPt(...Geom3.vec3.transformMat4([], edge.end.position, ref.absTrans));

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
              pickedEdges.push(edge);
            }
          }
        });
      });
    });

    console.log(pickedEdges);
  }
}
