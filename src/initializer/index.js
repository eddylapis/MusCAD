import Workspace from './workspace';
import { RenderingContainer } from './material';
import { programFace, programLine } from './program';
import LookAtCamera from '../camera/lookat-camera';
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
  Application.programFace.use();
  Application.programFace.updateUniform('mat_projection', c.matProj);

  Application.programLine.use();
  Application.programLine.updateUniform('mat_projection', c.matProj);
});

CameraEvent.listenViewChange(c => {
  Application.programFace.use();
  Application.programFace.updateUniform('mat_view', c.matView);
  Application.programFace.updateUniform('light_dir', c.eye);

  Application.programLine.use();
  Application.programLine.updateUniform('mat_view', c.matView);
});

Workspace.camera = new LookAtCamera();
Workspace.camera.lookAt([0,0,4000], [0,0,0], [0,1,0]);
Workspace.camera.emitProjChange();

//tmp
let gl = Workspace.gl;
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.STENCIL_TEST);

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
