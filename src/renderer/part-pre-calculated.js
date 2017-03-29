import Part from './part';

export default class PartPreCalculated extends Part {
  constructor(...args) {
    super(...args);
  }

  getVertexArray(face) {
    let vertexArray;
    if (this.isBack) {
      vertexArray = _bufferArray(face._vertices, face._normalBack, face._uvsBack, true);
    } else {
      vertexArray = _bufferArray(face._vertices, face._normal, face._uvsFront);
    }

    vertexArray.numPts = face._vertices.length;

    return vertexArray;
  }
}

function _bufferArray(vertices, normal, uvs, decrement=false) {
  let arr = [];

  if (decrement) {
    for (let i=vertices.length-1; i >= 0 ; i--) {
      arr.push(vertices[i][0]);
      arr.push(vertices[i][1]);
      arr.push(vertices[i][2]);
      arr.push(normal[0]);
      arr.push(normal[1]);
      arr.push(normal[2]);
      arr.push(uvs[i][0]);
      arr.push(uvs[i][1]);
    }
  } else {
    for (let i=0, len=vertices.length; i < len; i++) {
      arr.push(vertices[i][0]);
      arr.push(vertices[i][1]);
      arr.push(vertices[i][2]);
      arr.push(normal[0]);
      arr.push(normal[1]);
      arr.push(normal[2]);
      arr.push(uvs[i][0]);
      arr.push(uvs[i][1]);
    }
  }

  return arr;
}
