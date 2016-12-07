import {Workspace} from '../initialize';
import BufferContext from '../graphics/rendering-context/buffer-context';

import Geom3 from 'geom3';

import _ from 'lodash';

let edgeSelRenderingObj = {
  edgeSelBufName: 'edgeSelBuffer',
};

let gl = Workspace.gl;
function genRenderingEdgeSelObj(edges) {
  let bufferPts = [];
  _.forEach(edges, (edge, edgeID) => {
    _.values(Workspace.definitions[edge.definitionID].references)
      .forEach(ref => {
        bufferPts.push(Geom3.vec3.transformMat4([], edge.start.position, ref.absTrans));
        bufferPts.push(Geom3.vec3.transformMat4([], edge.end.position, ref.absTrans));
      });
  });

  // upload data
  if (bufferPts.length > 0) {
    let dataView = new Float32Array(_.flatten(bufferPts));
    BufferContext.withArray(edgeSelRenderingObj.edgeSelBufName, (c) => {
      c.arrayData(dataView);
    });
    edgeSelRenderingObj.len = bufferPts.length;
  } else {
    edgeSelRenderingObj.len = null;
  }
}

module.exports = {
  genRenderingEdgeSelObj,
  edgeSelRenderingObj,
};
