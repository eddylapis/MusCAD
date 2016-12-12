import {Workspace} from '../initialize';
import BufferContext from '../graphics/rendering-context/buffer-context';

import { _genVertexBuffer, _genFaceProps } from './gen-rendering-def';

import genDefBoundingBox from '../modeling/gen-def-boundingbox';

import Geom3 from 'geom3';

import _ from 'lodash';

const IDX_PER_LINE = 6;
let edgeSelRenderingObj = {};
let faceSelRenderingObj = {};

let gl = Workspace.gl;
function genRenderingFaceSelObj(faces) {
  let allFaceBuffer = [];

  _.forEach(faces, (face, faceID) => {
    let definition = Workspace.definitions[face.definitionID];
    _.values(definition.references)
      .forEach(ref => {
        let localIdxTable = {};
        let vBuffer = _genVertexBuffer(localIdxTable, definition.vertices);
        let { localIndices: faceIndices, } = _genFaceProps(localIdxTable, face);

        let ptsBuffer = idxToPts(vBuffer, faceIndices.concat([...faceIndices].reverse()));

        allFaceBuffer = allFaceBuffer.concat(ptsBuffer);
      });
  });

  // upload data
  if (allFaceBuffer.length > 0) {
    BufferContext.bindArray('selFacesBuffer');
    BufferContext.arrayData(new Float32Array(allFaceBuffer));

    faceSelRenderingObj.len = allFaceBuffer.length / 3;
  } else {
    faceSelRenderingObj.len = null;
  }

  function idxToPts(flatArr, indices) {
    let pts = [];
    indices.forEach(i => { pts.push(flatArr[3*i], flatArr[3*i+1], flatArr[3*i+2]); });
    return pts;
  }

  function transformMat4Flat(out, a, m) {
    for (let i=0;i<a.length/3;++i) {
      let x = a[3*i], y = a[3*i+1], z = a[3*i+2],
          w = m[3] * x + m[7] * y + m[11] * z + m[15];
      w = w || 1.0;
      out[3*i] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
      out[3*i+1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      out[3*i+2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    }
    return out;
  }
}

function genRenderingEdgeSelObj(edges, refs=[]) {
  let lines = [];

  // selected edges
  _.forEach(edges, (edge, edgeID) => {
    _.values(Workspace.definitions[edge.definitionID].references)
      .forEach(ref => {
        lines.push([
          Geom3.vec3.transformMat4([], edge.start.position, ref.absTrans),
          Geom3.vec3.transformMat4([], edge.end.position, ref.absTrans)
        ]);
      });
  });

  // selected boundingbox
  _.forEach(refs, (ref, refID) => {
    let def = Workspace.definitions[ref.definitionID];
    let bb = genDefBoundingBox(def);

    if (bb) {
      for (let line of bb.edges) {
        lines.push([
          Geom3.vec3.transformMat4([], line[0], ref.absTrans),
          Geom3.vec3.transformMat4([], line[1], ref.absTrans)
        ]);
      }
    }
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
}

module.exports = {
  genRenderingEdgeSelObj,
  edgeSelRenderingObj,
  genRenderingFaceSelObj,
  faceSelRenderingObj,
};
