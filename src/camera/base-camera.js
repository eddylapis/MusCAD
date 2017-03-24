import { mat4 } from 'geom3';

import CameraEvents from './camera-events';

export default class BaseCamera {
  constructor(){}

  get matProj() { throw('Not Implemented'); }
  get matView() { throw('Not Implemented'); }
  emitViewChange() { CameraEvents.emitViewChange(this, this.matView); }
  emitProjChange() { CameraEvents.emitProjChange(this, this.matProj); }
}
