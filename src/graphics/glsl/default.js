let VertexShaderSrc = `
  uniform mat4 matView;
  uniform mat4 matProjection;
  uniform mat4 matTexUV;
  uniform mat4 matTexScale;

  uniform sampler2D transformations;
  uniform float transWidth;
  uniform float transHeight;

  attribute vec3 aPosition;
  attribute float aModelID;
  attribute vec4 aColor;

  varying mediump vec4 vColor;
  varying mediump vec2 vTexCoord;

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

    vTexCoord = (matTexScale * matTexUV * vec4(aPosition, 1.0)).xy;
    vColor = aColor;

    gl_Position = matProjection * matView * matTrans * vec4(aPosition, 1.0);
  }
`;

let FragmentShaderSrc = `
  uniform bool hasTexture;

  varying mediump vec4 vColor;
  varying mediump vec2 vTexCoord;

  uniform sampler2D texture0;

  void main(void) {
    if (hasTexture) {
      gl_FragColor = vec4(texture2D(texture0, vTexCoord).rgb, vColor.a);
    } else {
      gl_FragColor = vColor;
    }
  }
`;

module.exports = {
  VertexShaderSrc,
  FragmentShaderSrc,
};
