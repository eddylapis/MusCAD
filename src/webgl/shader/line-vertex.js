import gl from '../gl';
import BasicShader from './base-shader';

export default class LineVertex extends BasicShader {
  get shaderType() { return gl.VERTEX_SHADER; }
  get src() {
    return [
      'uniform mat4 mat_projection;',
      'uniform mat4 mat_view;',
      'uniform mat4 mat_ins;',

      'attribute vec3 a_position;',

      'void main(void) {',
      '  gl_Position = mat_projection * mat_view * mat_ins * vec4(a_position, 1.0);',
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
      {name: 'a_position', type: 'vec3', array: true},
    ];
  }
}
