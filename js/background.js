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
