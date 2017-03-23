import {
  FaceVertex, FaceFragment,
  LineVertex, LineFragment,
  BasicProgram,
} from '../webgl';

// Initialize Default Rendering Program
let fvShader = new FaceVertex(s => s.compile());
let ffShader = new FaceFragment(s => s.compile());
let fProgram = new BasicProgram(p => {
  p.create();
  p.attachVertexIns(fvShader);
  p.attachFragmentIns(ffShader);
  p.link();
  p.use();
  p.registerUniforms();
  p.registerAttributes();
});


let lvShader = new LineVertex(s => s.compile());
let lfShader = new LineFragment(s => s.compile());
let lProgram = new BasicProgram(p => {
  p.create();
  p.attachVertexIns(lvShader);
  p.attachFragmentIns(lfShader);
  p.link();
  p.use();
  p.registerUniforms();
  p.registerAttributes();
});

module.exports = {
  programFace: fProgram,
  programLine: lProgram,
};
