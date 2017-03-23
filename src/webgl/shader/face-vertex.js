import gl from '../gl';
import BasicShader from './base-shader';

export default class FaceVertex extends BasicShader {
  get shaderType() { return gl.VERTEX_SHADER; }
  get src() {
    return [
      'uniform mat4 mat_projection;',
      'uniform mat4 mat_view;',
      'uniform mat4 mat_ins;',

      'uniform vec3 ambient_color;',
      'uniform vec3 light_diffuse_color;',
      'uniform vec3 light_dir;',

      'uniform vec4 color;',
      'attribute vec3 a_position;',
      'attribute vec3 a_normal;',
      'attribute vec2 a_uv;',

      'varying mediump vec4 v_color;',
      'varying mediump vec2 v_texcoord;',
      'varying mediump vec3 v_light;',

      'vec3 directionalLight(vec3 normal) {',
      '  return ambient_color +',
      '    max(dot(normal, light_dir), 0.0) * light_diffuse_color;',
      '}',


      'void main(void) {',
      '  v_light = directionalLight(a_normal);',
      '  v_color = color;',
      '  v_texcoord = a_uv.xy;',
      '  gl_Position = mat_projection * mat_view * mat_ins * vec4(a_position, 1.0);',
      '}',
    ].join("\n");
  }

  getUniformList() {
    return [
      {name: 'color', type: 'vec4'},
      {name: 'has_texture', type: 'bool'},
      {name: 'texture0', type: 'sampler2D'},
      {name: 'mat_projection', type: 'mat4'},
      {name: 'mat_view', type: 'mat4'},
      {name: 'mat_ins', type: 'mat4'},
      {name: 'ambient_color', type: 'vec3'},
      {name: 'light_diffuse_color', type: 'vec3'},
      {name: 'light_dir', type: 'vec3'},
    ];
  }

  getAttributeList() {
    return [
      {name: 'a_normal', type: 'vec3', array: true},
      {name: 'a_position', type: 'vec3', array: true},
      {name: 'a_uv', type: 'vec2', array: true},
    ];
  }
}
