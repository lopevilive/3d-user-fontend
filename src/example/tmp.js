import * as THREE from 'three';
import { ModelManage } from '@/base/index'

export const init = () => {
  const md = new ModelManage()
  document.querySelector('#scene').appendChild( md.renderer.domElement );
  const geometry = new THREE.PlaneGeometry(100, 100)
  // const geometry = new THREE.SphereGeometry(100)
  // const geometry = new THREE.CircleGeometry(50)
  const loader = new THREE.TextureLoader()
  const texture = loader.load('/src/assets/img/55555555.jpg')
  texture.repeat = new THREE.Vector2(2,2)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  const material = new THREE.MeshLambertMaterial({
    // color: new THREE.Color(0xf09264)
    map: texture
  })
  const mesh = new THREE.Mesh(geometry, material)
  md.scene.add(mesh)
  md.addAssistance() // 添加辅助工具
  md.formatCameraPos([9, 6, 154], [0, 0, 0])
  md.light.addAmbientLight()
  console.log(geometry)
  // console.log(geometry.attributes)
}