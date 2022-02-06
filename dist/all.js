(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = () => {
  const gradVs = require('../shaders/background.vert'),
	gradFs = require('../shaders/background.frag');

  let grad = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,1,1),
    new THREE.ShaderMaterial({
      vertexShader: gradVs(),
      fragmentShader: gradFs()
    })
  )

  grad.material.depthWrite = false;
  grad.renderOrder = 0;

  return grad;
}

},{"../shaders/background.frag":5,"../shaders/background.vert":6}],2:[function(require,module,exports){
module.exports = () => {
  const vs = require('../shaders/heart.vert');
  const fs = require('../shaders/heart.frag');

  let limit = 1.8,
      step = limit / 10000,
      points = [];
  
  for (let i = -limit; i <= limit; i += step)
    points.push(new THREE.Vector3(i, 0, 0));
  
  let g = new THREE.BufferGeometry().setFromPoints(points);
  let m = new THREE.ShaderMaterial({
    uniforms:{
      aVal: {value: 25}
    },
    linewidth: 2.0,
    vertexShader: vs(),
    fragmentShader: fs(),
  });
  
  const heart = new THREE.Line(g, m);
  heart.renderOrder = 1;
  return heart;
}

},{"../shaders/heart.frag":7,"../shaders/heart.vert":8}],3:[function(require,module,exports){
(function() {
  "use-strict";

  const gradientBackground = require('./background');
  const heartCurve = require('./heart');
  const spriteImage = require('./sprite');
  
  const scene = new THREE.Scene();

  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspectRatio = window.innerWidth / window.innerHeight;
  
  const camera = new THREE.PerspectiveCamera(60, aspectRatio, 1, 1000);
  camera.position.set(0, 0, 5);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  const heart = heartCurve();
  const background = gradientBackground();
  const sprite = spriteImage();

  scene.add(heart);
  scene.add(background);
  scene.add(sprite);

  const clock = new THREE.Clock();

  window.addEventListener('resize',
			  onWindowResize(aspectRatio, width, height));
  function onWindowResize(aspect, w, h) {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  renderer.setAnimationLoop(() => {
    const mix = (x, y, a) => x * (1 - a) + y * a;
    heart.material.uniforms.aVal.value =
      mix(-30.0, 30.0, Math.sin(clock.getElapsedTime() * 0.15) * 0.5 + 0.5);
    renderer.render(scene, camera);
  });
})();

},{"./background":1,"./heart":2,"./sprite":4}],4:[function(require,module,exports){
module.exports = (scene) => {
  const t = new THREE.TextureLoader().load("assets/while.webp");
  const m =  new THREE.SpriteMaterial({map: t});
  const s = new THREE.Sprite(m);
  s.position.set(0, -1.2);
  s.scale.set(1.5, 1.5);
  return s;
}  

},{}],5:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUv; \n" +
" \n" +
"vec3 background(vec2 uv) \n" +
"{ \n" +
"  uv -= 0.5; \n" +
"  uv.y -= 0.15; \n" +
"     \n" +
"  float d = length(uv); \n" +
"  return mix(vec3(0.1515, 0.1375, 0.455), vec3(0.054, 0.0415, 0.225), d);    \n" +
"} \n" +
" \n" +
"void main(){ \n" +
"  gl_FragColor = vec4(background(vUv), 1.0); \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],6:[function(require,module,exports){
module.exports = function parse(params){
      var template = "varying vec2 vUv; \n" +
" \n" +
"void main(){ \n" +
"  vUv = uv; \n" +
"  float depth = -1.; //or maybe 1. you can experiment \n" +
"  gl_Position = vec4(position.xy, depth, 1.); \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],7:[function(require,module,exports){
module.exports = function parse(params){
      var template = "void main() \n" +
"{ \n" +
"  gl_FragColor = vec4( 1., 0., 0., 1.0 ); \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}],8:[function(require,module,exports){
module.exports = function parse(params){
      var template = "#define PI radians(180.0) \n" +
"   \n" +
"uniform float aVal; \n" +
"     \n" +
"float heart(float x, float t){ \n" +
"  return pow(abs(0.45*x), 0.7)+0.5 + sqrt(0.6*(3.0-x*x))*(-cos(t * PI * x)); \n" +
"} \n" +
"     \n" +
"void main() \n" +
"{ \n" +
"  vec3 pos = position; \n" +
"  pos.y = 1.0 + heart(pos.x, aVal); \n" +
"  pos *= 0.8; \n" +
"  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 ); \n" +
"  gl_Position = projectionMatrix * mvPosition; \n" +
"} \n" +
" \n" 
      params = params || {}
      for(var key in params) {
        var matcher = new RegExp("{{"+key+"}}","g")
        template = template.replace(matcher, params[key])
      }
      return template
    };

},{}]},{},[3]);
