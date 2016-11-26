function genFaceBuffers(definition) {
  let localIdxTable = {};
  let vBuffer = new Float32Array(Object.keys(definition.vertices).length * 3);

  let ind = -1;
  for (let key in definition.vertices) {
    let position = definition.vertices[key].position;
    localIdxTable[key] = ++ind;
    vBuffer[ind*3]     = position[0];
    vBuffer[ind*3 + 1] = position[1];
    vBuffer[ind*3 + 2] = position[2];
  }

  let faceBuffers = [];
  for (let key in definition.faces) {
    let face = definition.faces[key];
    let loops = [
      ...face.outerLoop,
      ...face.innerLoops.reduce((m,e) => m.concat(e), []),
    ];
    let vLoopIndex = earcut(
      loops.map(v => v.position).reduce((m,e) => m.concat(...e), []),
      _getInnerLoopStartingIdx(face.outerLoop, face.innerLoops),
      3
    );
    let localIndices = new Uint16Array(
      vLoopIndex.map(i => loops[i]).map(v => localIdxTable[v.id])
    );

    faceBuffers.push({
      buf: vBuffer,
      idx: localIndices,
    });
  }

  return faceBuffers;

  function _getInnerLoopStartingIdx(outerLoop, innerLoops=[]) {
    let indices = innerLoops.map(l => l.length);
    let startLen = outerLoop.length;
    indices.unshift(0)
    indices = indices.map(i => i + startLen);
    indices.pop()
    return indices;
  }
}

function addBuffer(bufferObj, arrTrans) {
  BufferContext.withArray('vertexBuffer', (c) => {
    c.appendArray(bufferObj.buf);
  });

  let indexOffset = BufferContext.headIndexDiff('vertexBuffer', bufferObj.buf);
  let shiftedIndices = bufferObj.idx.map(i => i + indexOffset);

  BufferContext.appendElement(shiftedIndices);
}

module.exports = {
  faceBuffers,
  addBuffer,
}
