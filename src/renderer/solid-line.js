import Geom3 from 'geom3';

import { ArrayF32, stride, offset } from '../webgl';

import flatten from 'lodash/fp/flatten';

export default class SolidLine {
  constructor(transArray, edges) {
    this.edges = edges;

    this.compute();
    this.upload();

    this.transArray = transArray || [];
    this.numIns = transArray.length;
  }

  compute() {
    let aStore = [];
    let bStore = [];
    let sStore = [];

    let add = pushPts.bind(null, aStore, bStore, sStore);

    let edges = this.edges;

    for (let eid in edges) {
      let edge = edges[eid];
      if (edge.soft) continue;
      add(edge.start.position, edge.end.position);
    }

    this.aStore = flatten(aStore);
    this.bStore = flatten(bStore);
    this.sStore = sStore;
  }

  upload() {
    let aStore = this.aStore;
    let bStore = this.bStore;
    let sStore = this.sStore;

    let bufferA = new ArrayF32();
    this.bufferA = bufferA;
    bufferA.init();
    bufferA.bind();
    bufferA.alloc(aStore.length);
    bufferA.uploadSub(0, new Float32Array(aStore));

    let bufferB = new ArrayF32();
    this.bufferB = bufferB;
    bufferB.init();
    bufferB.bind();
    bufferB.alloc(aStore.length);
    bufferB.uploadSub(0, new Float32Array(bStore));

    let bufferS = new ArrayF32();
    this.bufferS = bufferS;
    bufferS.init();
    bufferS.bind();
    bufferS.alloc(aStore.length);
    bufferS.uploadSub(0, new Float32Array(sStore));

    this.numPts = sStore.length;
  }

  render(program) {
    if (!this.numPts) return;
    let gl = program.gl;

    this.bufferA.bind();
    program.updateAttrPointer('a_a', 0, 0);
    this.bufferB.bind();
    program.updateAttrPointer('a_b', 0, 0);
    this.bufferS.bind();
    program.updateAttrPointer('a_s', 0, 0);

    for (let i=0; i<this.numIns; i++) {
      program.updateUniform('mat_ins', this.transArray[i]);
      gl.drawArrays(gl.TRIANGLES, 0, this.numPts);
    }
  }
}

function pushPts(aStore, bStore, sStore, a, b) {
  a = [a[0], a[1], a[2]];
  b = [b[0], b[1], b[2]];
  aStore.push(...[a,a,b,b,b,a]);
  bStore.push(...[b,b,a,a,a,b]);
  sStore.push(...[-1,1,-1,-1,1,-1]);
}
