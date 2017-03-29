import { Application, Workspace } from '../initializer';
import {BoundingBox} from '../modeling';
import {mat4} from 'geom3';

import foreach from 'lodash/fp/foreach';
import map from 'lodash/fp/map';
import minBy from 'lodash/fp/minby';
import maxBy from 'lodash/fp/maxby';

export class Picker {
  constructor() {
  }

  get matProjView() {
    return mat4.mul(
      new Float32Array(16),
      Workspace.camera.matProj,
      Workspace.camera.matView
    );
  }
  get back() { return Workspace.camera.zaxis; }

  pick(x, y) {
    let approxInstances = [];
    foreach((def, id) => {
      if (_definitionEmpty(def)) return;

      let pts = map(v => v.position)(def.vertices);
      let bb = BoundingBox.buildFromPts(pts);

      foreach((ref, id) => {
        let pts2d = map(p => Workspace.procToScreen(p, ref.absTrans))(bb.corners);
        let minX = minBy('0')(pts2d)[0];
        let minY = minBy('1')(pts2d)[1];
        let maxX = maxBy('0')(pts2d)[0];
        let maxY = maxBy('1')(pts2d)[1];

        if (x < minX || x > maxX) return;
        if (y < minY || y > maxY) return;

        approxInstances.push(ref);
      })(def.references);
    }
    )(Application.definitions);

    console.log(approxInstances);
  }
}

function _definitionEmpty(def) {
  for (let vid in def.vertices) {
    return false;
  }
  return true;
}
