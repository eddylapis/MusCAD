import Workspace from './workspace';
import { RenderingContainer } from './material';
import { programFace, programLine } from './program';
import DefaultCamera from '../camera/default-camera';
import CameraEvent from '../camera/camera-events';
import { BasicTexture } from '../webgl';

let Application = {};
Application.Workspace = Workspace;
Application.RenderingContainer = RenderingContainer;

Application.programFace = programFace;
Application.programLine = programLine;

// Setup Lights
programFace.use();
programFace.updateUniform('ambient_color', [.88, .88, .88]);
programFace.updateUniform('light_diffuse_color', [.5, .5, .5]);

// Initialize Camera
CameraEvent.listenProjChange(c => {
  programFace.use();
  programFace.updateUniform('mat_projection', c._matProjection);
  programLine.use();
  programLine.updateUniform('mat_projection', c._matProjection);
});

CameraEvent.listenViewChange(c => {
  let matCam = c._matCamera;
  programFace.use();
  programFace.updateUniform('mat_view', matCam);
  programFace.updateUniform('light_dir', [matCam[8], matCam[9], matCam[10]]);
  programLine.use();
  programLine.updateUniform('mat_view', matCam);
});

Workspace.camera = new DefaultCamera();
Workspace.camera._matCamera = new Float32Array(
  [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -4000, 1,
  ]
);
Workspace.camera.emitViewChange();
Workspace.camera.emitProjChange();

//tmp

let gl = Workspace.gl;
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


// Avoid Warning
let buffer = new BasicTexture();
buffer.init();
buffer.bind();

module.exports = {
  Application,
  RenderingContainer,
  Workspace,
};
