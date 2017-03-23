import {
  Application,
  RenderingContainer,
  Workspace,
} from './initializer';

// Run Development Scripts
let runDevScripts = require('./_dev');
runDevScripts(Application);

import OrbitTool from './tools/orbit';
Workspace.selectTool(new OrbitTool(Workspace));

// Main Loop
Workspace.forever(() => {
  Application.programFace.enableArrayAll();
  Application.programFace.use();
  for (let k in Application.RenderingContainer.parts) {
    Application.RenderingContainer.parts[k].render(Application.programFace);
  }
  Application.programFace.disableArrayAll();

  Application.programLine.use();
  Application.programLine.enableArrayAll();
  for (let k in Application.RenderingContainer.solidLines) {
    Application.RenderingContainer.solidLines[k].render(Application.programLine);
  }
  Application.programLine.disableArrayAll();
});
