import * as THREE from 'three';
import { ModelManage } from '@/base/index'


export const init = async () => {
  const md = new ModelManage()
  document.querySelector('#scene').appendChild( md.renderer.domElement );
  await md.loadModel('/src/assets/model/tmp/main.gltf')
  // console.log(md)
  // md.light.addPointLight({pos: [1.5, 2, 0.2],intensity: 10 }) // 添加点光源
  md.formatCameraPos([0.12, 1.8, 2.9], [0.05, 1.26, -0.36])
  md.loadHdr('/src/assets/hdr/buikslotermeerplein_1k.hdr')
  

  md.setMaterial('Obj3d66-4750728-1-671', {side: THREE.DoubleSide, map: null, roughness: 1, metalness: 0.35})

  md.setMaterial('Obj3d66-4750728-35-395', {roughness: 1,metalness: 0.35})
  md.setMap('Obj3d66-4750728-35-395', '/src/assets/img/wood/5311727364379_.pic_hd.jpg')
  md.setNormalMap('Obj3d66-4750728-35-395', '/src/assets/img/vf1oairg_2K_Normal.jpg')
  md.setRoughnessMap('Obj3d66-4750728-35-395', '/src/assets/img/vf1oairg_2K_Roughness.jpg')

  md.setMaterial('Obj3d66-4750728-3-834', {roughness: 1,metalness: 0.35}) // 地板
  md.setMap('Obj3d66-4750728-3-834', '/src/assets/img/wood/5311727364379_.pic_hd.jpg')


  md.addAssistance() // 添加辅助工具
  md.assistance.debugger('Obj3d66-4750728-3-834')


  // md.assistance.countMesh(true)
  // md.assistance.rangeReplaceColor([0,10], true)
}