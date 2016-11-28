let VertexShaderSrc = `
  uniform mat4 matView;
  uniform mat4 matProjection;
  uniform sampler2D transformations;
  attribute vec3 aPosition;
  attribute float aModelID;
  uniform float transWidth;
  uniform float transHeight;

  void main(void) {
    float col = mod(aModelID, transWidth / 2.) * 4.;
    float row = floor(aModelID / transWidth / 2.);
    float onePixelX = 1. / transWidth;
    vec2 uv = vec2((col + 0.5) / transWidth, (row + 0.5) / transHeight);
    vec4 trans1 = texture2D(transformations, uv);
    vec4 trans2 = texture2D(transformations, uv + vec2(onePixelX, 0));
    vec4 trans3 = texture2D(transformations, uv + vec2(onePixelX * 2., 0));
    vec4 trans4 = texture2D(transformations, uv + vec2(onePixelX * 3., 0));

    mat4 matTrans = mat4(trans1, trans2, trans3, trans4);

    gl_Position = matProjection * matView * matTrans * vec4(aPosition, 1.0);
  }
`;

let FragmentShaderSrc = `
  varying mediump vec4 vColor;

  void main(void) {
    gl_FragColor = vec4(1,0,0,1);
  }
`;

module.exports = {
  VertexShaderSrc,
  FragmentShaderSrc,
};
