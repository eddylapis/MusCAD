export default function flattenVertices(definition) {
  let idx      = 0,
      vertices = definition.vertices,
      dataView = new Float32Array(Object.keys(vertices).length * 3),
      key,
      pos;

  for (key in vertices) {
    pos = vertices[key].position;
    dataView[idx*3]     = pos[0];
    dataView[idx*3 + 1] = pos[1];
    dataView[idx*3 + 2] = pos[2];
    idx++;
  }

  return dataView;
}
