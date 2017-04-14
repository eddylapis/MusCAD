import importJSON from '../modeling/import-brep-json';

export default function dummy(Application) {
  let json = require('raw-loader!./model.json');
  json = JSON.parse(json);
  importJSON(Application, json);

  let RenderingContainer = Application.RenderingContainer;
  for (let k in Application.materials) RenderingContainer.updateMaterial(Application.materials[k]);
  for (let k in Application.definitions) RenderingContainer.updateDefinition(Application.definitions[k]);
}
