#define PI radians(180.0)
  
uniform float aVal;
    
float heart(float x, float t){
  return pow(abs(0.45*x), 0.7) + 0.5 + sqrt(0.6 * (3.0 - x*x)) * (-cos(t * PI * x));
}
    
void main()
{
  vec3 pos = position;
  pos.y = 1.0 + heart(pos.x, aVal);
  pos *= 0.8;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
