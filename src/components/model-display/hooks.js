import { ref } from 'vue'
import * as THREE from 'three';
import { ModelManage } from '@/base/index'

const modelCfg = [
  {
    path: '/src/assets/model/tmp/main.gltf',
    exec: (md, url) => {
      md.formatCameraPos([0.53, 1.75, 3.94], [0.42, .95, -0.31])
      md.loadHdr('/src/assets/hdr/buikslotermeerplein_1k.hdr')
      
    
      md.setMaterial('Obj3d66-4750728-1-671', {side: THREE.DoubleSide, map: null, roughness: 1, metalness: 0.35})
    
      md.setMaterial('Obj3d66-4750728-35-395', {roughness: 1,metalness: 0.35})
      md.setMap('Obj3d66-4750728-35-395', url)
      // md.setNormalMap('Obj3d66-4750728-35-395', '/src/assets/img/BBpMpePwfHyvZihLDmrlYczTboxvVUgM.jpg')
      md.setRoughnessMap('Obj3d66-4750728-35-395', '/src/assets/img/vf1oairg_2K_Roughness.jpg')
    
      md.setMaterial('Obj3d66-4750728-3-834', {roughness: 1,metalness: 0.35}) // 地板
      md.setMap('Obj3d66-4750728-3-834', '/src/assets/img/wood/5311727364379_.pic_hd.jpg')
    }
  }
]


export const useModelDisplay = (props, emits, domId) => {
  const isShow = ref(false)
  let md

  const isShowLoading = ref(false)

  const handleClose = () => {
    isShow.value = false
  }

  const initModel = async () => {
    md = new ModelManage()
    document.querySelector(domId).appendChild( md.renderer.domElement );
    const cfg = modelCfg[0]
    const {path, exec} = cfg
    
    try {
      isShowLoading.value = true
      await md.loadModel(path)
      exec(md, props.productInfo.url)
    } finally {
      isShowLoading.value = false
    }
  }

  const destoryModel = () => {
    if (!md) return true
    md.destory()
    md = null
    return true
  }

  return {
    isShow,
    initModel,
    isShowLoading,
    handleClose,
    destoryModel
  }
}