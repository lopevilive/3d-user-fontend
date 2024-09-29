
<template>
  <div id="scene">
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
import { ModelManage } from '/src/base/index'
import {init} from '/src/example/wardrobe'
// import {init} from '/src/example/tmp'

const md = new ModelManage()

const init1 = async () => {
  document.querySelector('#scene').appendChild( md.renderer.domElement );
  await md.loadModel('/src/assets/model/buy1/main.gltf')
  md.light.addPointLight({pos: [1.5, 2, 0.2],intensity: 10 }) // 添加点光源
  md.formatCameraPos([0.12, 1.8, 2.9], [0.05, 1.26, -0.36])
  // md.loadHdr('/src/assets/hdr/zwartkops_straight_morning_1k.hdr')

  // md.setMaterial('Obj3d66-4750728-89-244', {roughness: 0.8, metalness: 0.1})
  // md.setNormalMap('Obj3d66-4750728-89-244', '/src/assets/img/BBpMpePwfHyvZihLDmrlYczTboxvVUgM.jpg')
  // md.setMap('Obj3d66-4750728-89-244', '/src/assets/img/WQdvmdeepVaZVvNKbcOFKwTiPakmetBM.jpg')
  // md.setMap('Obj3d66-4750728-89-244', '/src/assets/img/Snipaste_2024-08-28_22-16-03.png')
  // Obj3d66-4750728-56-368
  // Obj3d66-4750728-89-244
  // Obj3d66-4750728-54-49
  // const res = md.scene.getObjectByName('Obj3d66-4750728-89-244')
  // md.scene.remove(res)
  // console.log(res)



  // const mesh = md.scene.getObjectByName('Obj3d66-4750728-89-244')
  // console.log(mesh)
  md.addAssistance() // 添加辅助工具
  // md.assistance.gui.add(mesh.material,'roughness', 0, 1)
  // md.assistance.gui.add(mesh.material,'metalness', 0, 1)
  md.assistance.countMesh()
  md.assistance.rangeReplaceColor([0,60])
}
// onMounted(init1)
onMounted(init)



</script>


<style scoped>
#info {
	position: absolute;
	top: 10px;
	width: 100%;
	text-align: center;
	z-index: 100;
	display:block;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
