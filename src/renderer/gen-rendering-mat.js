import BufferContext from '../graphics/rendering-context/buffer-context';
import getImageData from '../util/get-image-data';
import _ from 'lodash';
import Geom3 from 'geom3';

const DEFAULT_FRONT_COLOR = [.98, .98, .98, 1];
const DEFAULT_BACK_COLOR = [.62, .74, .93, 1];

const DEFAULT_FRONT = {
  color: DEFAULT_FRONT_COLOR,
  id: 'defaultFront',
};

const DEFAULT_BACK = {
  color: DEFAULT_BACK_COLOR,
  id: 'defaultBack',
};

let materialRenderingObjects = {};
let lastTextureID = -1;

let gl = BufferContext.gl;

function _newTex0Buffer(bufferName) {
  BufferContext.initTexture(bufferName);

  gl.activeTexture(gl.TEXTURE0);
  BufferContext.bindTex2d(bufferName);
  BufferContext.allocTex2df(1, 1); // avoid WebGL warning

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
}

function genRenderingMatObj(material) {
  let renderingObj = {};
  let color = material.color;
  let texture = material.texture;
  let setDrawingState;

  if (texture) {
    let bufferName = `matTextureBuffer${++lastTextureID}`;
    _newTex0Buffer(bufferName);

    getImageData(texture.base64, (imgData) => {
      gl.activeTexture(gl.TEXTURE0);
      BufferContext.bindTex2d(bufferName);

      BufferContext.uploadTex2d(imgData);
      renderingObj.textureLoaded = true;
    });

    renderingObj.textureBufferName = bufferName;
    renderingObj.textureScaleMat = Geom3.mat4.fromScaling(new Float32Array(16),
      [1 / texture.width, 1 / texture.height, 1]
    );
  }

  renderingObj.setDrawingState = (programContext) => {
    programContext.attr4fv('aColor', new Float32Array(color));
    if (renderingObj.textureLoaded) {
      //active texture: 0
      BufferContext.bindTex2d(renderingObj.textureBufferName);
      programContext.uniform1i('hasTexture', true);
      programContext.uniformMat4('matTexScale', renderingObj.textureScaleMat);
    } else {
      programContext.uniform1i('hasTexture', false);
    }
  };

  return renderingObj;
}

function genRenderingMatObjs(materials) {
  _.values(materials).forEach((mat) => {
    materialRenderingObjects[mat.id] = genRenderingMatObj(mat);
  });

  materialRenderingObjects[DEFAULT_FRONT.id] =
    genRenderingMatObj(DEFAULT_FRONT);
  materialRenderingObjects[DEFAULT_BACK.id] =
    genRenderingMatObj(DEFAULT_BACK);
}

module.exports = {
  materialRenderingObjects,
  genRenderingMatObj,
  genRenderingMatObjs,
};
