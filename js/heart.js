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
