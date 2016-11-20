let VertexShaderSrc = `
  attribute vec3 aPosition;

  void main(void) {
    gl_Position = vec4(aPosition, 1.0);
  }
`;

let FragmentShaderSrc = `
  void main(void) {
    gl_FragColor = vec4(1,0,0,1);
  }
`;

module.exports = {
  VertexShaderSrc,
  FragmentShaderSrc,
};
