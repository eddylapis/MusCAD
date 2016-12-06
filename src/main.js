import {Workspace} from './initialize';
import { genRenderingDefObj, uploadRenderingDefObj } from './renderer/gen-rendering-def';
import { genRenderingMatObjs } from './renderer/gen-rendering-mat';
import renderingLoop from './renderer/rendering-loop';

import OrbitTool from './tools/orbit';
import SelectTool from './tools/select';

import _ from 'lodash';

// load demo
import {definitions, materials} from './demo';
Workspace.definitions = definitions;

// set camera
Workspace.camera._matCamera = new Float32Array(
  [
    0.76, 0.66, -0, 0,
    -0.37, 0.43, 0.83, 0,
    0.54, -0.62, 0.56, 0,
    1707.52, -1484.96, 1759.9, 1
  ]
);
Workspace.camera.emitViewChange();

genRenderingMatObjs(materials);

_.forEach(definitions, (definition, defID) => {
  uploadRenderingDefObj(genRenderingDefObj(definition));
});

// Start Mian Loop
Workspace.forever(renderingLoop);

// Register Tools
Workspace.Tools = {};
Workspace.Tools.OrbitTool = OrbitTool;
Workspace.Tools.SelectTool = SelectTool;
Workspace.selectTool(new Workspace.Tools.OrbitTool(Workspace));
