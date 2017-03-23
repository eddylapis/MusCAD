import gl from '../gl';
import TextureByte from './texture-byte';

export default class BasicTexture extends TextureByte {
  init() {
    super.init();
    this.active0();
    this.bind();

    this.alloc(1, 1); // avoid WebGL warning

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }
}
