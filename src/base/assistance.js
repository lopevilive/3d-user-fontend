import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class Assistance {
  constructor(md) {
    this.md = md
    this.gui = new GUI()
    window.md = md

    this.init()
  }
  addAxesHelper() {
    const axesHelper = new THREE.AxesHelper( 200 );
    this.md.scene.add( axesHelper );
  }
  addLightHelper() {
    for (const light of this.md.scene.children) {
      if (light.type === 'DirectionalLight') {
        const helper = new THREE.DirectionalLightHelper( light, 1 );
        this.md.scene.add( helper );
      }
      if (light.type === 'PointLight') {
        const helper = new THREE.PointLightHelper(light, .1)
        this.gui.add(light, 'intensity', 0, 50)
        this.md.scene.add(helper)
      }
    }
  }
  countMesh(filterUv = true) {
    let ret = 0
    this.md.scene.traverse((item) => {
      if (item.type === 'Mesh') {
        if (filterUv && !item.geometry.attributes.uv) return
        else ret += 1
      }
    })
    console.log('count', ret)
  }
  rangeReplaceColor(range, filterUv = true) {
    let queue = [...this.md.scene.children]
    let idx = 0;
    const ret = []
    while(queue.length) {
      const obj = queue.pop()
      // if (obj.type === 'Mesh' && obj.geometry.attributes.uv) {
      if (obj.type === 'Mesh') {
        if (filterUv && !obj.geometry.attributes.uv) {
          continue
        }
        if (idx >= range[0] && idx <= range[1]) {
          obj.material = obj.material.clone()
          obj.material.color = new THREE.Color( 0xce3026 );
          // console.log(obj.geometry.attributes.uv)
          ret.push(obj.name)
        }
        idx += 1
      }
      if (obj.children?.length) {
        queue = [...obj.children, ...queue]
      }
    }
    console.log(ret)
  }
  debugger(name) {
    const mesh = this.md.scene.getObjectByName(name)
    if (!mesh) return
    console.log(mesh, 'mesh')
    mesh.material = mesh.material.clone()
    this.gui.add(mesh.material, 'roughness', 0, 1) //粗糙度。取值范围为0.0到1.0，取值越小镜面反射越明显，取值越大漫反射越明显。
    this.gui.add(mesh.material, 'metalness', 0, 1) //金属度。取值范围为0.0到1.0，取值越大外观越接近金属材料。
  }



  init() {
    this.addAxesHelper()
    this.addLightHelper()
  }
}