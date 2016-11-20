import Workspace from './workspace/Workspace';
import { VertexShaderSrc, FragmentShaderSrc } from './graphics/glsl/default';
import makeShader from './graphics/makeShader';
import makeProgram from './graphics/makeProgram';
import setRenderingState from './graphics/setRenderingState';

Workspace.initialize((ws) => {
  ws.createCanvas();
  ws.registerGL();
  ws.appendCanvas('default-workspace');
});

let vertexShader = makeShader(Workspace.gl, (m) => {
  m.src = VertexShaderSrc;
  m.compileVertex();
});

let fragmentShader = makeShader(Workspace.gl, (m) => {
  m.src = FragmentShaderSrc;
  m.compileFragment();
});

let program = makeProgram(Workspace.gl, (m) => {
  m.create();

  m.setShader(vertexShader);
  m.setShader(fragmentShader);

  m.link();
  m.use();
});
Workspace.glProgram = program;

setRenderingState(Workspace.gl, (m) => {
  m.defineFront();
  m.drawFrontOnly();
  m.depthTest();
  m.blendTexture();
});

_checkError(vertexShader);
_checkError(fragmentShader);
_checkError(program);

function _checkError(val) {
  if (val && val.error) throw(val.error);
}

module.exports = {
  Workspace,
}
