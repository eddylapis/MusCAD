import { Application, Workspace } from '../initializer';
import Geom3 from 'geom3';

import _ from 'lodash';

export default class OrbitTool {
  constructor() {
    this.last_x = null;
    this.last_y = null;
    this.state = {
      rotating: false,
      target: _calcCenter(Application.definitions),
    };
    this.camera = Application.Workspace.camera;
    this.displayWidth = Application.Workspace.displayWidth;
    this.displayHeight = Application.Workspace.displayHeight;
  }

  activate() { }

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

    let dz    = event.wheelDelta;

    _zoom(this.camera, dz, this.state.target);
  }

  mousemove(event) {
    event.preventDefault();

    if (!this.state.rotating) {
      this.last_x = null;
      this.last_y = null;
      return null;
    };

    let speed = 4;

    let x = event.clientX,
        y = event.clientY;

    if (this.last_x && this.last_y) {
      let dx = x - this.last_x,
          dy = y - this.last_y;

      dx = dx / this.displayWidth * speed;
      dy = dy / this.displayHeight * speed;

      if (!dx || !dy) return;

      _orbitAround(this.camera, dy, dx, this.state.target);
    }

    this.last_x = x;
    this.last_y = y;
  }
}

function _zoom(c, dz, target=[0,0,0]) {
  let mat4           = Geom3.mat4,
      vec3           = Geom3.vec3,
      speed          = .15,
      matCamera      = c.matCamera,
      zoomFactor     = Math.sign(dz) * speed,
      zoomIn         = zoomFactor > 0,
      transVec       = vec3.subtract([], target, c.eye);

  if (zoomIn && _tooClose(target, c)) return;
  if (!zoomIn && _tooFar(target, c)) return;

  vec3.scale(transVec, transVec, speed * Math.sign(dz));
  let trans = mat4.translate([], mat4.identity([]), transVec);

  c.updateMatCamera(mat4.mul([], trans, matCamera));
  c.emitViewChange();

  function _tooClose(target, camera) {
    let distance = vec3.len(vec3.subtract([], target, c.eye));
    return distance / camera.near < 3;
  }

  function _tooFar(target, camera) {
    let distance = vec3.len(vec3.subtract([], target, c.eye));
    return distance / camera.far > 1.2;
  }
}

function _orbitAround(c, dx, dy, target=[0,0,0]) {
  let mat4           = Geom3.mat4,
      vec3           = Geom3.vec3,
      matCamera      = c.matCamera,
      transVec       = vec3.negate([], target),
      transVecInv    = target,
      transTarget    = mat4.translate([], mat4.identity([]), transVec),
      transTargetInv = mat4.invert([], transTarget),
      transLon       = mat4.rotate([], mat4.identity([]), dy, c.yaxis),
      transLat       = mat4.rotate([], mat4.identity([]), dx, c.xaxis),
      transRot       = mat4.mul([], transLat, transLon);

  c.updateMatCamera(
    mat4.mul([], transTargetInv,
    mat4.mul([], transRot,
    mat4.mul([], transTarget,
    matCamera
    )))
  );
  c.emitViewChange();
}

function _calcCenter(definitions) {
  // tmp
    let count = 0,
        x     = 0,
        y     = 0,
        z     = 0;

  _.values(definitions).forEach(def => {
    _.values(def.references).forEach(ref => {
      if (Object.keys(def.vertices).length) {
        x += ref.absTrans[12];
        y += ref.absTrans[13];
        z += ref.absTrans[14];
        count += 1;
      }
    });
  });

  return [x / count, y / count, z / count];
}
