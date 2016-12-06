import Geom3 from 'geom3';

import _ from 'lodash';

export default class OrbitTool {
  constructor(workspace) {
    this.last_x = null;
    this.last_y = null;
    this.state = {
      rotating: false,
      target: this._calcCenter(workspace.definitions),
    }
    this.camera = workspace.camera;
    this.displayWidth = workspace.displayWidth;
    this.displayHeight = workspace.displayHeight;
  }

  _calcCenter(definitions) {
    let count = 0,
        x     = 0,
        y     = 0,
        z     = 0;

    _.values(definitions).forEach(def => {
      _.values(def.references).forEach(ref => {
        x += ref.absTrans[12];
        y += ref.absTrans[13];
        z += ref.absTrans[14];
        count += 1;
      });
    });

    return [x / count, y / count, z / count];
  }

  activate() {
  }

  mousedown(event) { this.state.rotating = true; }
  mouseup(event) { this.state.rotating = false; }
  mouseenter(event) { this.state.zooming = true; }
  mouseleave(event) {
    this.state.rotating = false;
    this.state.zooming = false;
  }

  wheel(event) {
    event.preventDefault();

    if (!this.state.zooming) return;

    let dz    = event.wheelDelta,
        speed = 0.8,
        cam   = this.camera;

    let matV = Geom3.mat4.copy([], cam.matView);
    let viewx = [matV[0], matV[4], matV[8]];
    let viewy = [matV[1], matV[5], matV[9]];

    matV[12] = -Geom3.dot(this.state.target, viewx);
    matV[13] = -Geom3.dot(this.state.target, viewy);
    matV[14] = matV[14] * Math.pow(speed, Math.sign(dz));

    Geom3.mat4.invert(cam._matCamera, matV);
    cam.emitViewChange();
  }

  mousemove(event) {
    event.preventDefault();

    if (!this.state.rotating) {
      this.last_x = null;
      this.last_y = null;
      return null;
    };

    let speed = 2;

    let x = event.clientX,
        y = event.clientY;

    if (this.last_x && this.last_y) {
      let dx = x - this.last_x,
          dy = y - this.last_y;

      dx = dx / this.displayWidth * speed;
      dy = dy / this.displayHeight * speed;

      if (!dx || !dy) return;

      orbitAround(this.camera, dy, dx);
    }

    this.last_x = x;
    this.last_y = y;

    function orbitAround(c, dx, dy, target=[0,0,0]) {
      let viewx = [c.matCamera[0], c.matCamera[1], c.matCamera[2]];
      let viewy = [c.matCamera[4], c.matCamera[5], c.matCamera[6]];
      let newViewMat = Geom3.mat4.clone(c.matView);
      Geom3.mat4.rotate(newViewMat, newViewMat, dx, viewx);
      Geom3.mat4.rotate(newViewMat, newViewMat, dy, viewy);

      _normalizeMat4(newViewMat);

      Geom3.mat4.invert(c._matCamera, newViewMat)
      c.emitViewChange();
    }

    function _normalizeMat4(m) {
      let tmpVec = [];
      Geom3.vec3.normalize(tmpVec, [m[0], m[4], m[8]]);
      m[0] = tmpVec[0];
      m[4] = tmpVec[1];
      m[8] = tmpVec[2];
      Geom3.vec3.normalize(tmpVec, [m[1], m[5], m[9]]);
      m[1] = tmpVec[0];
      m[5] = tmpVec[1];
      m[9] = tmpVec[2];
      Geom3.vec3.normalize(tmpVec, [m[2], m[6], m[10]]);
      m[2] = tmpVec[0];
      m[6] = tmpVec[1];
      m[10] = tmpVec[2];
    }
  }
}
