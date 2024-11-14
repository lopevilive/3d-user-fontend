import * as THREE from 'three';
import { ModelManage } from '@/base/index'


export const init = async () => {
  const md = new ModelManage()
  document.querySelector('#scene').appendChild( md.renderer.domElement );
  await md.loadModel('/model/wardrobe/scene.gltf');
  md.light.addPointLight({pos: [1.5, 2, 0.2],intensity: 10 }) // 添加点光源
  md.addAssistance() // 添加辅助工具
  md.formatCameraPos([25, 173, 370], [17, 108, -18])
  md.loadHdr('/hdr/zwartkops_straight_morning_1k.hdr')

  md.setMap('door_R__0','/img/WQdvmdeepVaZVvNKbcOFKwTiPakmetBM.jpg')
  md.setMap('wardrobe__0','/img/WQdvmdeepVaZVvNKbcOFKwTiPakmetBM.jpg')
  md.setMap('door_L__0','/img/WQdvmdeepVaZVvNKbcOFKwTiPakmetBM.jpg')

  // wardrobe__0
  // door_R__0
  // door_L__0
  const mesh = md.scene.getObjectByName('wardrobe__0')
  // mesh.geometry.attributes.uv = new THREE.BufferAttribute(new Float32Array(),2)
  // mesh.material.normalMap = null
  // mesh.material.roughnessMap = null
  // mesh.material.metalnessMap = null
  console.log(mesh.material.map)
}