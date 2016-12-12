import BoundingBox from './boundingbox';

import _ from 'lodash';

export default function genDefBoundingBox(definition) {
  let pts = _.values(definition.vertices).map(v => v.position);

  if (pts.length !== 0) {
    return BoundingBox.fromPts(pts);
  } else {
    return null;
  }
}
