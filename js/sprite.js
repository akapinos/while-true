module.exports = (scene) => {
  const t = new THREE.TextureLoader().load("assets/while.webp");
  const m =  new THREE.SpriteMaterial({map: t});
  const s = new THREE.Sprite(m);
  s.position.set(0, -1.2);
  s.scale.set(1.5, 1.5);
  return s;
}  
