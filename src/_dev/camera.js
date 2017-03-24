import { mat4 } from 'geom3';

export default function sugar(Application) {
  let Workspace = Application.Workspace;
  window.camArr = (a) => {
    Workspace.camera._matView= new Float32Array(a);
    Workspace.camera.emitViewChange();
  };
}
