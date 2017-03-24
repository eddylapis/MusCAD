import importJSON from '../modeling/import-json';

export default function dummy(Application) {
  let json = require('raw-loader!./model.json');
  json = JSON.parse(json);
  let {definitions, materials} = importJSON(json);

  let RenderingContainer = Application.RenderingContainer;
  for (let k in materials) RenderingContainer.updateMaterial(materials[k]);
  for (let k in definitions) RenderingContainer.updateDefinition(definitions[k]);

  Application.definitions = definitions;
  Application.materials = materials;
}
