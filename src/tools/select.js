import { Application, Workspace } from '../initializer';
import Geom3 from 'geom3';
import {Picker} from '../picker';

export default class SelectTool {
  constructor() {
    this.state = {
    };
    this.camera = Application.Workspace.camera;
    this.displayWidth = Application.Workspace.displayWidth;
    this.displayHeight = Application.Workspace.displayHeight;
  }

  activate() { }

  mouseup(event) {}

  mousemove(event, x, y) {
    let picker = new Picker();
    picker.pick(x, y);
  }
}
