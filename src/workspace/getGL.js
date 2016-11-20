/**
 * Get GL context from Canvas Element.
 * @param canvas
 */

export default function getGL(canvas) {
  let gl = null;

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch(e) {
    throw('Error: Connot get GL context from canvas.');
  }

  return gl;
}
