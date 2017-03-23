import dummy from './dummy';
import camera from './camera';
import setCamera from './camera-script';

export default function devScript(Application) {
  dummy(Application);
  camera(Application);
  setCamera();
}
