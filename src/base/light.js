import * as THREE from 'three';

export class Light {
  constructor(md) {
    this.md = md
  }

  addAmbientLight() { // 全屏光
    const light = new THREE.AmbientLight();
    this.md.scene.add( light );
  }
  addDirectionalLight() { //平行光
    const light = new THREE.DirectionalLight( 0xffffff, 1)
    light.position.set(10,10,10)
    this.md.scene.add( light );
  }
  addPointLight(payload) { // 点光源
    const{color = 0xffffff,intensity = 1,distance = 100,decay  = 2,
      pos = [0,0,0]
    } = payload
    const light = new THREE.PointLight( color, intensity, distance, decay);
    light.position.set(...pos)
    this.md.scene.add(light)
  }
}