/**
 * Camera Events
 */

import {EventEmitter} from 'events';

class CameraEvents extends EventEmitter {
  emitViewChange(...args) { this.emit('ViewChange', ...args); }
  listenViewChange(cb) { this.on('ViewChange', cb); }

  emitProjChange(...args) { this.emit('ProjChange', ...args); }
  listenProjChange(cb) { this.on('ProjChange', cb); }
}

let instance = new CameraEvents();

export default instance;
