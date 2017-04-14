import gl from '../gl';
import BasicShader from './base-shader';

export default class LineVertex extends BasicShader {
  get shaderType() { return gl.VERTEX_SHADER; }
  get src() {
    return [
      'uniform mat4 mat_projection;',
      'uniform mat4 mat_view;',
      'uniform mat4 mat_ins;',

      'attribute vec3 a_a;',
      'attribute vec3 a_b;',
      'attribute float a_s;',

      'void main(void) {',
      '  float size = 1.;',
      '  vec3 camera_z = vec3(0.,0.,1.);',
      '  vec4 cam_a = mat_view * mat_ins * vec4(a_a, 1);',
      '  vec4 cam_b = mat_view * mat_ins * vec4(a_b, 1);',
      '  vec3 dir = cam_b.xyz - cam_a.xyz;',
      '  vec3 offset = size * a_s * normalize(cross(dir, camera_z));',

      '  gl_Position = mat_projection * vec4(cam_a.xyz + offset, 1.0);',
      '}',
    ].join("\n");
  }

  getUniformList() {
    return [
      {name: 'mat_projection', type: 'mat4'},
      {name: 'mat_view', type: 'mat4'},
      {name: 'mat_ins', type: 'mat4'},
    ];
  }

  getAttributeList() {
    return [
      {name: 'a_a', type: 'vec3', array: true},
      {name: 'a_b', type: 'vec3', array: true},
      {name: 'a_s', type: 'float', array: true},
    ];
  }
}
