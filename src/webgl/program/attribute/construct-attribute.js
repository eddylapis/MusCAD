import * as Klasses from './attributes';

const mapKlass = {
  float: Klasses.Attribute1F,
  vec3: Klasses.Attribute3F,
  vec4: Klasses.Attribute4F,
  mat4: Klasses.Attribute16F,
};

const mapArrayKlass = {
  float: Klasses.ArrayAttribute1F,
  vec3: Klasses.ArrayAttribute3F,
  vec2: Klasses.ArrayAttribute2F,
  mat4: Klasses.ArrayAttribute16F,
};

export default function constructAttribute(attrDef, programIns) {
  let attrName  = attrDef.name,
      attrType  = attrDef.type,
      attrKlass = (attrDef.array) ? mapArrayKlass[attrType] : mapKlass[attrType];

  if (!attrKlass) {
    throw('Undefined attribute type: ' + attrType);
  }

  let attrIns = new attrKlass(attrName);

  attrIns.initLocation(programIns);

  return {
    key: attrName,
    value: attrIns,
  };
}
