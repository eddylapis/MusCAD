import mapValues from 'lodash/fp/mapvalues';

export default function mapVertexIndex(definition) {
  let idx = 0;

  /* the order of enumeration is implementation dependent.
   * However, enumeration order is assumed to be consistent at runtime level.
   */
  return mapValues(() => idx++)(definition.vertices);
}
