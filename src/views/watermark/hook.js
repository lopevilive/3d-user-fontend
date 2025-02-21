import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  shopInfoManage, commonFetch, watermarkManage, globalLoading, watermark,
  uploadFile, textToPngFile, formatWatermarkPayload
} from '@/util'
import { saveWatermarkCfg } from '@/http'
import { showImagePreview, showFailToast } from 'vant'

export const posMap = {
  batch: '平铺',
  northwest: '左上角',
  southwest: '左下角',
  northeast: '右上角',
  southeast: '右下角',
  center: '居中',
}

export const useWaterMark = () => {

  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId

  const shopInfo = ref({})

  const watermarkCfg = ref({})

  const posDisplay = computed({
    get() {
      if (watermarkCfg.value.batch === 1) return '平铺'
      return posMap[watermarkCfg.value.gravity]
    },
  })
  
  
  const getShopInfo = async () => {
    let ret = await shopInfoManage.getData(shopId)
    shopInfo.value = ret[0]
  }

  const dialogModTextRef = ref()
  const modText = async () => {
    const ret = await dialogModTextRef.value.show(watermarkCfg.value.text)
    watermarkCfg.value.text = ret
    toCreateWatermark()
  }

  const posSelectRef = ref()
  const modPos = async () => {
    const ret = await posSelectRef.value.show()
    if (ret === 'batch') {
      watermarkCfg.value.batch = 1
      watermarkCfg.value.degree = 45
    } else {
      watermarkCfg.value.batch = 0
      watermarkCfg.value.gravity = ret
    }
    toCreateWatermark()
  }

  const dialogSizeRef = ref()
  const modSize = async () => {
    const ret = await dialogSizeRef.value.show({
      val: watermarkCfg.value.fontsize,
      title: '水印大小',
      min: 5,
      max: 100,
      step: 1
    })
    watermarkCfg.value.fontsize = ret
    toCreateWatermark()
  }

  const modDegree = async () => {
    const ret = await dialogSizeRef.value.show({
      val: watermarkCfg.value.degree,
      title: '水印角度',
      min: 0,
      max: 360,
      step: 1
    })
    watermarkCfg.value.degree = ret
    toCreateWatermark()
  }

  const modDissolve = async () => {
    const ret = await dialogSizeRef.value.show({
      val: watermarkCfg.value.dissolve,
      title: '水印透明度',
      min: 2,
      max: 100,
      step: 1
    })
    watermarkCfg.value.dissolve = ret
    toCreateWatermark()
  }

  const dialogColorRef = ref()
  const modColor = async () => {
    const ret = await dialogColorRef.value.show(watermarkCfg.value.fill)
    watermarkCfg.value.fill = ret
    toCreateWatermark()
  }
  
  const textNodeRef = ref()
  const toCreateWatermark = async () => {
    const { text, fill, type, image } = watermarkCfg.value
    if (type === 2) {
      globalLoading.start()
      const file = await textToPngFile(text, {color: fill})
      const ret = await uploadFile(file, shopId, null, 1)
      watermarkCfg.value.textUrl = `//${ret.Location}`
      globalLoading.stop()
    }

    if (type === 1) {
      if (!image) return
    }
    watermarkCfg.value.fileid = `watermark_${shopId}_${Date.now()}.jpg`
    
    try {
      globalLoading.start()
      const res = await watermark(watermarkCfg.value)
      watermarkCfg.value.previewUrl = `//${res.UploadResult.ProcessResults.Object.Location}`
    } catch(e) {
      console.error(e)
    } finally {
      globalLoading.stop()
    }
  }
  
  const getCfg = async () => {
    let ret = await watermarkManage.getData(shopId)
    if (!ret.length) return
    ret = ret[0]
    const {configkey, cfg, type, text, previewUrl} = ret
    const newObj = {
      type, text, configkey, previewUrl,
      ...JSON.parse(cfg)
    }
    watermarkCfg.value = newObj
    if (!previewUrl) toCreateWatermark()

    // if (ret.length) {
    //   const {configkey, cfg, type, text, previewUrl} = ret[0]
    //   let newObj = { type, text, configkey, previewUrl }
    //   if (cfg) {
    //     newObj = {...newObj, ...JSON.parse(cfg)}
    //   }
    //   watermarkCfg.value = newObj
    // } else {
    //   watermarkCfg.value = watermark_cfg_def
    //   let key = shopInfo.value.url.split(',')[0]
    //   key = key.split('.com/')[1]
    //   watermarkCfg.value.configkey = key;
    //   watermarkCfg.value.text = shopInfo.value.name.replaceAll(emojiReg, '')
    //   toCreateWatermark()
    // }
  }
  
  const saveHandle = async() => {
    const { type, image } = watermarkCfg.value
    const payload = formatWatermarkPayload(watermarkCfg.value, shopId)
    if (type === 1 && !image) {
      showFailToast('请上传图片水印')
      return
    }
    await commonFetch(saveWatermarkCfg, payload, '保存成功～')
    watermarkManage.dirty(shopId)
    router.go(-1)

  }
  
  const handlePreview = () => {
    if (!watermarkCfg.value.previewUrl) return
    showImagePreview([watermarkCfg.value.previewUrl], 0)
  }
  
  const replaceImgRef = ref()
  const changeImgHandle = () => {
    replaceImgRef.value.chooseFile()
  }

  const startReplaceHandle = () => {
    globalLoading.start()
  }
  
  const handleReplaceImg = (str) => {
    globalLoading.stop()
    let key = str.split('.com/')[1]
    watermarkCfg.value.configkey = key
    toCreateWatermark()
  }
  
  const switchToImg = () => {
    watermarkCfg.value.type = 1
    if (watermarkCfg.value.image) {
      toCreateWatermark()
    }
  }

  const waterImgRef = ref()
  const modImage = async () => {
    waterImgRef.value.chooseFile()
  }

  const handleWaterImg = (str) => {
    globalLoading.stop()
    watermarkCfg.value.image = str
    toCreateWatermark()
  }
  
  const switchToText = () => {
    watermarkCfg.value.type = 2
    toCreateWatermark()
  }
  
  const init = async () => {
    await getShopInfo()
    await getCfg()
  }

  return {
    init, watermarkCfg, modText, dialogModTextRef, posDisplay,
    modPos, posSelectRef, modSize, dialogSizeRef, modDegree, modDissolve,
    dialogColorRef, modColor, saveHandle, handlePreview, changeImgHandle,
    replaceImgRef, handleReplaceImg, startReplaceHandle, switchToImg, waterImgRef,
    handleWaterImg, modImage, switchToText, textNodeRef
  }

}