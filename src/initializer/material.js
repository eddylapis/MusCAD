import { RenderingContainer } from '../renderer';

const defaultFront = {
  id: '__default_front',
  color: [1, 0, 0, 1],
  texture: null,
};

const defaultBack = {
  id: '__default_back',
  color: [0, 0, 1, 1],
  texture: null,
};

RenderingContainer.updateMaterial(defaultFront);
RenderingContainer.updateMaterial(defaultBack);

module.exports = {
  RenderingContainer,
};
