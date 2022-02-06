varying vec2 vUv;

vec3 background(vec2 uv)
{
  uv -= 0.5;
  uv.y -= 0.15;
    
  float d = length(uv);
  return mix(vec3(0.1515, 0.1375, 0.455), vec3(0.055, 0.0415, 0.225), d);   
}

void main(){
  gl_FragColor = vec4(background(vUv), 1.0);
}
