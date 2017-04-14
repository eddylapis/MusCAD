import OrbitTool from '../tools/orbit';
import SelectTool from '../tools/select';

export default function setTools(Application) {
  window.select = () => {
    Application.Workspace.selectTool(new SelectTool());
  };
  window.orbit = () => {
    Application.Workspace.selectTool(new OrbitTool());
  };
  window.orbit();
}
