import gl from '../gl';
import BasicShader from './base-shader';

export default class LineFragment extends BasicShader {
  get shaderType() { return gl.FRAGMENT_SHADER; }
  get src() {
    return [
      'void main(void) {',
      '  gl_FragColor = vec4(0.,0.,0.,1.);',
      '}',
    ].join("\n");
  }
}
