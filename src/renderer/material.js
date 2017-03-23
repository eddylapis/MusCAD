import { BasicTexture, gl } from '../webgl';
import getImageData from '../util/get-image-data';

export default class Material {
  constructor(data) {
    this.id = data.id;
    this.data = data;
    this.color = data.color;
    this.texture = data.texture;
    this.buffer = null;
    this.hasTexture = !!data.texture;
    this.textureLoaded = false;

    this.upload();
  }

  upload() {
    if (!this.hasTexture) return;
    let self = this;
    let texture = this.texture;
    let buffer = new BasicTexture();

    this.buffer = buffer;

    buffer.init();

    getImageData(texture.base64, (imgData) => {
      buffer.active0();
      buffer.bind();
      buffer.upload(imgData);
      self.textureLoaded = true;
    });
  }

  setRendering(program) {
    program.updateUniform('color', this.color);

    if (this.hasTexture && this.textureLoaded) {
      program.updateUniform('texture0', 0);
      program.updateUniform('has_texture', true);
      this.buffer.active0();
      this.buffer.bind();
    } else {
      program.updateUniform('has_texture', false);
    }
  }
}
