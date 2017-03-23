import Geom3 from 'geom3';

import { ArrayF32, stride, offset } from '../webgl';

export default class SolidLine {
  constructor(transArray, edges) {
    this.edges = edges;

    this.compute();
    this.upload();

    this.transArray = transArray || [];
    this.numIns = transArray.length;
  }

  compute() {
    let vertexArray = [];
    let edges = this.edges;

    for (let eid in edges) {
      let edge = edges[eid];
      vertexArray.push(...edge.start.position);
      vertexArray.push(...edge.end.position);
    }

    this.vertexArray = new Float32Array(vertexArray);
    this.numPts = vertexArray.length / 3;
  }

  upload() {
    let buffer = new ArrayF32();
    this.buffer = buffer;
    buffer.init();
    buffer.bind();
    buffer.alloc(this.vertexArray.length);
    buffer.uploadSub(0, this.vertexArray);
  }

  render(program) {
    if (!this.numPts) return;
    let gl = program.gl;
    let extIns = program.extIns;

    this.buffer.bind();
    program.updateAttrPointer('a_position', 0, 0);

    for (let i=0; i<this.numIns; i++) {
      program.updateUniform('mat_ins', this.transArray[i]);
      gl.drawArrays(gl.LINES, 0, this.numPts);
    }
  }
}
