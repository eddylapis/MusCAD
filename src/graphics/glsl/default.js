let VertexShaderSrc = `
  uniform mat4 matView;
  uniform mat4 matProjection;
  attribute vec3 aPosition;

  void main(void) {
    gl_Position = matProjection * matView * vec4(aPosition, 1.0);
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
