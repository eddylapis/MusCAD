import * as Klasses from './uniforms';

const mapKlass = {
  bool: Klasses.UniformBool,
  float: Klasses.Uniform1F,
  vec3: Klasses.Uniform3F,
  vec4: Klasses.Uniform4F,
  mat4: Klasses.UniformMat4F,
  sampler2D: Klasses.Uniform1I,
};

export default function constructUniform(uniformDef, programIns) {
  let uniformName  = uniformDef.name,
      uniformType  = uniformDef.type,
      uniformKlass = mapKlass[uniformType];

  if (!uniformKlass) {
    throw('Undefined uniform type: ' + uniformType);
  }

  let uniformIns = new uniformKlass(uniformName);

  uniformIns.initLocation(programIns);

  return {
    key: uniformName,
    value: uniformIns,
  };
}
