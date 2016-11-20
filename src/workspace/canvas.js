/**
 * Canvas Creator
 * @module Canvas
 * @private
 */

export default class Canvas {
  static create() {
    let canvas = document.createElement('canvas');
    canvas.id = 'workspace-canvas';
    canvas.width = 100;
    canvas.height = 100;
    canvas.style.position = 'absolute';
    canvas.style.border = '1px solid';
    return canvas;
  }
}
