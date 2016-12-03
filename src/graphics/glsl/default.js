let VertexShaderSrc = `
  uniform mat4 matView;
  uniform mat4 matProjection;
  uniform mat4 matTexUV;
  uniform mat4 matTexScale;

  uniform sampler2D transformations;
  uniform float transWidth;
  uniform float transHeight;

  uniform vec3 ambientColor;
  uniform vec3 lightDiffuseColor;
  uniform vec3 lightDirection;

  attribute vec3 aPosition;
  attribute float aModelID;
  attribute vec4 aColor;
  attribute vec3 aNormal;

  varying mediump vec4 vColor;
  varying mediump vec2 vTexCoord;
  varying mediump vec3 vLight;

  vec3 directionalLight(vec3 normal) {
    return ambientColor +
           max(dot(normal, lightDirection), 0.0) * lightDiffuseColor;
  }

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

    vLight = directionalLight(aNormal);

    gl_Position = matProjection * matView * matTrans * vec4(aPosition, 1.0);
  }
`;

let FragmentShaderSrc = `
  uniform bool hasTexture;

  varying mediump vec4 vColor;
  varying mediump vec2 vTexCoord;
  varying mediump vec3 vLight;

  uniform sampler2D texture0;

  void main(void) {
    if (hasTexture) {
      gl_FragColor = vec4(texture2D(texture0, vTexCoord).rgb * vLight, vColor.a);
    } else {
      gl_FragColor = vec4(vColor.rgb * vLight, vColor.a);
    }
  }
`;

module.exports = {
  VertexShaderSrc,
  FragmentShaderSrc,
};
