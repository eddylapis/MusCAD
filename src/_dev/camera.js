import { mat4 } from 'geom3';

export default function sugar(Application) {
  let Workspace = Application.Workspace;
  window._camLookAt = (e, t, u) => {
    Workspace.camera.lookAt(e, t, u);
  };
}
