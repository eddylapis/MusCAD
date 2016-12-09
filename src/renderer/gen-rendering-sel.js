import {Workspace} from '../initialize';
import BufferContext from '../graphics/rendering-context/buffer-context';

import Geom3 from 'geom3';

import _ from 'lodash';

const IDX_PER_LINE = 6;
let edgeSelRenderingObj = {};

let gl = Workspace.gl;
function genRenderingEdgeSelObj(edges) {
  let lines = [];
  _.forEach(edges, (edge, edgeID) => {
    _.values(Workspace.definitions[edge.definitionID].references)
      .forEach(ref => {
        lines.push([
          Geom3.vec3.transformMat4([], edge.start.position, ref.absTrans),
          Geom3.vec3.transformMat4([], edge.end.position, ref.absTrans)
        ]);
      });
  });

  // upload data
  if (lines.length > 0) {
    let projLineBufObj = genProjLineBuf(lines);

    BufferContext.bindArray('lnPos1Buffer');
    BufferContext.arrayData(projLineBufObj.pos1);

    BufferContext.bindArray('lnPos2Buffer');
    BufferContext.arrayData(projLineBufObj.pos2);

    BufferContext.bindArray('lnDirBuffer');
    BufferContext.arrayData(projLineBufObj.dir);

    BufferContext.bindElement('lnElemBuffer');
    BufferContext.elementData(projLineBufObj.idx);

    edgeSelRenderingObj.len = lines.length * IDX_PER_LINE;
  } else {
    edgeSelRenderingObj.len = null;
  }
}

module.exports = {
  genRenderingEdgeSelObj,
  edgeSelRenderingObj,
};

function genProjLineBuf(lines) {
  let pos1 = [];
  let pos2 = [];
  let dir = [];
  let idx = [];

  lines.forEach(([start, end], i) => {
    pos1.push(start, start, end, end);
    pos2.push(end, end, start, start);
    dir.push(1,-1,-1,1);
    idx.push(i*4, i*4, i*4 + 1, i*4 + 2, i*4 + 3, i*4 + 3);
  });

  return {
    pos1: new Float32Array(_.flatten(pos1)),
    pos2: new Float32Array(_.flatten(pos2)),
    dir: new Float32Array(dir),
    idx: new Uint16Array(idx),
  };
}
