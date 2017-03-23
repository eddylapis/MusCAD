/**
 * Canvas Creator
 * @module Canvas
 * @private
 */

export default class Canvas {
  static create() {
    let canvas = document.createElement('canvas');
    canvas.id = 'workspace-canvas';
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.border = '1px solid';

    return canvas;
  }
}
