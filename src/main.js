import {
  Application,
  RenderingContainer,
  Workspace,
} from './initializer';

// Run Development Scripts
let runDevScripts = require('./_dev');
runDevScripts(Application);

// Main Loop
let gl = Workspace.gl;
Workspace.forever(() => {
  gl.stencilFunc(gl.EQUAL, 0, 1);
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  Application.programFace.enableArrayAll();
  Application.programFace.use();
  for (let k in Application.RenderingContainer.parts) {
    Application.RenderingContainer.parts[k].render(Application.programFace);
  }
  Application.programFace.disableArrayAll();

  gl.clear(gl.STENCIL_BUFFER_BIT);

  gl.stencilFunc(gl.ALWAYS, 0, 1);
  gl.stencilOp(gl.ZERO, gl.ZERO, gl.INCR);
  Application.programLine.use();
  Application.programLine.enableArrayAll();
  for (let k in Application.RenderingContainer.solidLines) {
    Application.RenderingContainer.solidLines[k].render(Application.programLine);
  }
  Application.programLine.disableArrayAll();
});
