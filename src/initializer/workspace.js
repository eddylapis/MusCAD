import Workspace from '../workspace/workspace';

// Initialize workspace
Workspace.initialize((ws) => {
  ws.createCanvas();
  ws.registerGL();
  ws.appendCanvas('default-workspace');
  ws.initEvents();
});

export default Workspace;
