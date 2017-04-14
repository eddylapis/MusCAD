import dummy from './dummy';
import camera from './camera';
import setCamera from './camera-script';
import geom3 from 'geom3';
import setTools from './tool';

export default function devScript(Application) {
  let size = 600;
  Application.Workspace.resizeCanvas(size, size);
  dummy(Application);
  camera(Application);
  setCamera();

  setTools(Application);

  window.Application = Application;
  window.cam = Application.Workspace.camera;
  window.Geom3 = geom3;
}
