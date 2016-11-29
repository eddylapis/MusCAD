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
  //m.defineFront();
  //m.drawFrontOnly();
  //m.depthTest();
  //m.blendTexture();
});

// Initialize Buffers
const _defaultBufferLength = 131072;
BufferContext.initialize(Workspace.gl, (c) => {
  c.initBuffer('vertexBuffer');
  c.bindArray('vertexBuffer');
  c.allocArray(_defaultBufferLength);

  c.initBuffer('faceIndexBuffer');
  c.bindElement('faceIndexBuffer');
  c.allocElement(_defaultBufferLength);

  c.initBuffer('edgeIndexBuffer');
  c.bindElement('edgeIndexBuffer');
  c.allocElement(_defaultBufferLength);

  c.initTexture('transTexBuffer');
});

// Initialize Attributes and Uniforms
ProgramContexts.initialize(Workspace.gl, Workspace.glProgram, (pc) => {
  pc.initUniform('transformations');
  pc.initUniform('matView');
  pc.initUniform('matProjection');
  pc.initUniform('transWidth');
  pc.initUniform('transHeight');

  BufferContext.withArray('vertexBuffer', (c) => {
    pc.initAttr('aPosition');
    pc.enableAttrArray('aPosition');
    pc.attrPointer3f('aPosition', 0, 0);
  });

  pc.initAttr('aModelID');

  let gl = Workspace.gl

  let ext = gl.getExtension("OES_texture_float");
  if (!ext) throw('No OES_texture_float');

  pc.uniform1i('transformations', 1); //texture1
  gl.activeTexture(gl.TEXTURE1);
  BufferContext.bindTex2d('transTexBuffer');
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  BufferContext.allocTex2df(4096, 256);
  pc.uniform1f('transWidth', 4096.0);
  pc.uniform1f('transHeight', 256.0);
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

function _checkError(val) {
  if (val && val.error) throw(val.error);
}

module.exports = {
  Workspace,
}
