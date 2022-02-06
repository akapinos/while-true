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
