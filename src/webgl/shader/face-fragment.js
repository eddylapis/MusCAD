import gl from '../gl';
import BasicShader from './base-shader';

export default class FaceFragment extends BasicShader {
  get shaderType() { return gl.FRAGMENT_SHADER; }
  get src() {
    return [
      'uniform bool has_texture;',
      'varying mediump vec4 v_color;',
      'varying mediump vec2 v_texcoord;',
      'varying mediump vec3 v_light;',

      'uniform sampler2D texture0;',

      'void main(void) {',
      '  if (has_texture) {',
      '    gl_FragColor = vec4(texture2D(texture0, v_texcoord).rgb * v_light, v_color.a);',
      '  } else {',
      '    gl_FragColor = vec4(v_color.rgb * v_light, v_color.a);',
      '  }',
      '}',
    ].join("\n");
  }
}
