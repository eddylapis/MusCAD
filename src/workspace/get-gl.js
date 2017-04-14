/**
 * Get GL context from Canvas Element.
 * @param canvas
 */

export default function getGL(canvas) {
  let gl = null;
  let opt = {stencil: true};

  try {
    gl = canvas.getContext('webgl', opt) || canvas.getContext('experimental-webgl', opt);
  } catch(e) {
    throw('Error: Connot get GL context from canvas.');
  }

  return gl;
}
