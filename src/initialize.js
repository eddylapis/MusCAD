import Workspace from './workspace/workspace';
import { VertexShaderSrc, FragmentShaderSrc } from './graphics/glsl/default';
import makeShader from './graphics/make-shader';
import makeProgram from './graphics/make-program';
import setRenderingState from './graphics/set-rendering-state';
import BufferContext from './graphics/rendering-context/buffer-context';
import ProgramContexts from './graphics/rendering-context/program-contexts';
import DefaultCamera from './camera/default-camera';

// Initialize Canvas
Workspace.initialize((ws) => {
  ws.createCanvas();
  ws.registerGL();
  ws.appendCanvas('default-workspace');
});

// Initialize Shaders and Program
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

_checkError(vertexShader);
_checkError(fragmentShader);
_checkError(program);

Workspace.glProgram = program;

// Initialize Rendering States
setRenderingState(Workspace.gl, (m) => {
  m.defineFront();
  m.drawFrontOnly();
  m.depthTest();
  m.blendTexture();
});

// Initialize Buffers
BufferContext.initialize(Workspace.gl, (c) => {
  c.initBuffer('vertexBuffer');
  c.bindArray('vertexBuffer');
  c.allocArray(65535);

  c.initBuffer('indexBuffer');
  c.bindElement('indexBuffer');
  c.allocElement(65535);
});

// Initialize Attributes and Uniforms
ProgramContexts.initialize(Workspace.gl, Workspace.glProgram, (pc) => {
  BufferContext.withArray('vertexBuffer', (c) => {
    pc.initAttr('aPosition');
    pc.enableAttrArray('aPosition');
    pc.attrPointer3f('aPosition', 0, 0);
  });

  pc.initUniform('matView');
  pc.initUniform('matProjection');
});

// Initialize Camera
Workspace.initCamera(
  (cam, matView)=>{
    if (cam === Workspace.camera) {
      ProgramContexts.with(Workspace.glProgram, (pc) => {
        pc.uniformMat4('matView', matView);
      });
    }
  },
  (cam, matProjection)=>{
    if (Workspace.camera && cam === Workspace.camera) {
      ProgramContexts.with(Workspace.glProgram, (pc) => {
        pc.uniformMat4('matProjection', matProjection);
      });
    }
  }
);

Workspace.camera = new DefaultCamera();
Workspace.camera.emitViewChange();
Workspace.camera.emitProjChange();

// Start Mian Loop
let gl = Workspace.gl;
Workspace.forever(() => {
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
});

function _checkError(val) {
  if (val && val.error) throw(val.error);
}

module.exports = {
  Workspace,
}
