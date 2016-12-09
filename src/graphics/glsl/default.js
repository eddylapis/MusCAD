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

  uniform bool renderingProjLine;

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

  attribute float lnDir;
  attribute vec3 lnPos2;

  vec4 projLine() {
    vec4 pos1Porj = matProjection * matView * vec4(aPosition, 1.0);
    vec4 pos2Porj = matProjection * matView * vec4(lnPos2, 1.0);

    vec2 pos1Screen = pos1Porj.xy / pos1Porj.w;
    vec2 pos2Screen = pos2Porj.xy / pos2Porj.w;

    vec2 dir = normalize(pos1Screen - pos2Screen);
    vec2 normal = vec2(-dir.y, dir.x);

    normal *= .1/2.;
    normal.x /= 1.;

    vLight = vec3(1,1,1);
    vColor = aColor;

    return vec4(pos1Screen + lnDir * normal,0,1);
  }

  void main(void) {
    if (renderingProjLine) {
      vLight = directionalLight(vec3(0,0,1));
      vColor = aColor;

      gl_Position = projLine();
    } else {
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
`
attribute vec3 position;
attribute float direction;
attribute vec3 next;
attribute vec3 previous;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float aspect;

uniform float thickness;
uniform int miter;

void main() {
  vec2 aspectVec = vec2(aspect, 1.0);
  mat4 projViewModel = projection * view * model;
  vec4 previousProjected = projViewModel * vec4(previous, 1.0);
  vec4 currentProjected = projViewModel * vec4(position, 1.0);
  vec4 nextProjected = projViewModel * vec4(next, 1.0);

  //get 2D screen space with W divide and aspect correction
  vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
  vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
  vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

  float len = thickness;
  float orientation = direction;

  //starting point uses (next - current)
  vec2 dir = vec2(0.0);
  if (currentScreen == previousScreen) {
    dir = normalize(nextScreen - currentScreen);
  }
  //ending point uses (current - previous)
  else if (currentScreen == nextScreen) {
    dir = normalize(currentScreen - previousScreen);
  }
  //somewhere in middle, needs a join
  else {
    //get directions from (C - B) and (B - A)
    vec2 dirA = normalize((currentScreen - previousScreen));
    if (miter == 1) {
      vec2 dirB = normalize((nextScreen - currentScreen));
      //now compute the miter join normal and length
      vec2 tangent = normalize(dirA + dirB);
      vec2 perp = vec2(-dirA.y, dirA.x);
      vec2 miter = vec2(-tangent.y, tangent.x);
      dir = tangent;
      len = thickness / dot(miter, perp);
    } else {
      dir = dirA;
    }
  }
  vec2 normal = vec2(-dir.y, dir.x);
  normal *= len/2.0;
  normal.x /= aspect;

  vec4 offset = vec4(normal * orientation, 0.0, 1.0);
  gl_Position = currentProjected + offset;
  gl_PointSize = 1.0;
}
`
