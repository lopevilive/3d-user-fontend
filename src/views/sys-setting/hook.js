import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { encryAlbum, getEncryCode, updateEncryCode, modShopStatus, saveWatermarkCfg } from '@/http'
import {
  toContactSys, shopInfoManage, commonFetch, watermarkManage, watermark_cfg_def, formatWatermarkPayload,
  textToPngFile, uploadFile, globalLoading, isVip, vipInfoManage, E_vip_map, toVip, getTypeName
} from '@/util'
import { showConfirmDialog } from 'vant';
import dayjs from 'dayjs'

export const useSysSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = +route.params.shopId

  const shopInfo = ref({})
  const vipInfo = ref({})
  const encryCode = ref()

  const toModAlbum = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const toModStaff = () => {
    router.push({name: 'staff-manage'})
  }

  const toViewProtocol = () => {
    router.push({name: 'user-protocol'})
  }

  const modEncry = async (bool) => {
    if (bool) {
      await showConfirmDialog({
        message: `加密后需要密码才能查看画册列表。`,
        confirmButtonText: '确认加密'
      })
    }
    const res = await commonFetch(encryAlbum, {shopId, encry: bool ? 1: 0})
    encryCode.value = res
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }

  const isEncry = computed({
    get() {
      if (shopInfo.value.encry === 1) return true
      return false
    },
    set(val) {
      modEncry(val)
    }
  })

  const setWatermarkCfg = async () => {
    globalLoading.start()
    try {
      let ret = await watermarkManage.getData(shopId)
      if (ret.length) return
      const watermarkCfg = {...watermark_cfg_def}
      watermarkCfg.configkey = shopInfo.value.url.split(',')[0].split('.com/')[1]
      watermarkCfg.text = shopInfo.value.name
      const file = await textToPngFile(watermarkCfg.text, {color: watermarkCfg.fill})
      const uploadRet = await uploadFile(file, shopId, null, 1)
      watermarkCfg.textUrl = `//${uploadRet.Location}`
      const payload = formatWatermarkPayload(watermarkCfg, shopId)
      await commonFetch(saveWatermarkCfg, payload)
      watermarkManage.dirty(shopId)
    } catch(e) {
      console.error(e)
      showFailToast(e.message || '水印开启有误，请联系管理员~')
    } finally {
      globalLoading.stop()
    }
  }
  
  const modWaterMark = async (val) => {
    if (val) {
      if (!isVip(shopInfo.value)) {
        await showConfirmDialog({
          message: '开通会员后可开启水印功能。\n(注：会员99/年)',
          confirmButtonText: '前往开通',
          cancelButtonText: '好的'
        })
        toVip(shopId)
        return
      }
      await showConfirmDialog({
        message: `后续新上传的图片都会自动添加水印`,
        confirmButtonText: '确认开启'
      })
      setWatermarkCfg() // 设置默认水印配置
    } else {
      await showConfirmDialog({
        message: `确定关闭水印？`,
        confirmButtonText: '确定'
      })
    }
    await commonFetch(modShopStatus, {shopId, waterMark: val ? 1: 0})
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }
  
  const isWaterMark = computed({
    get() {
      if (shopInfo.value?.waterMark === 1) return true
      return false
    },
    set(val) {
      modWaterMark(val)
    }
  })

  const toModAddressStatus = async (val) => {
    if (val) {
      await showConfirmDialog({message: '确定开启？'})
    }
    await commonFetch(modShopStatus, {shopId, addressStatus: val ? 1: 0})
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }
  
  const needAddress = computed({
    get() {
      if (shopInfo.value?.addressStatus === 1) return true
      return false
    },
    set(val) {
      toModAddressStatus(val)
    }
  })

  const toModInveExportStatus = async (val) => {
    if (val) {
      await showConfirmDialog({message: '确定开启？'})
    }
    await commonFetch(modShopStatus, {shopId, inveExportStatus: val ? 1: 0})
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }
  
  const inveExportStatus = computed({
    get() {
      if (shopInfo.value?.inveExportStatus === 1) return true
      return false
    },
    set(val) {
      toModInveExportStatus(val)
    }
  })

  const initShopInfo = async () => {
    const info = await shopInfoManage.getData(shopId)
    shopInfo.value = info[0]
    if (isEncry.value && !encryCode.value) {
      let code = await commonFetch(getEncryCode, {shopId})
      encryCode.value = code
    }
  }

  const refreshCode = async () => {
    await showConfirmDialog({
      message: `确定要刷新密码?`
    })
    const res = await commonFetch(updateEncryCode, {shopId})
    encryCode.value = res
  }

  const toFeedback = ()  => {
    router.push({name: 'feedback', params: {shopId}})
  }

  const handleWaterMark = () => {
    router.push({name: 'watermark'})
  }

  const isShowVip = computed(() => {
    if (['develop', 'trial', 'release'].includes(globalData.value.wxEnv)) return true
    return false
  })
  
  const showVip = () => {
    toVip(shopId)
  }

  const toModBannerStatus = async (val) => {
    const payload = {
      shopId, bannerStatus: val ? 1: 0
    }
    if (val) {
      let cfg = shopInfo.value.bannerCfg
      if (!cfg) {
        cfg = { url: shopInfo.value.url.split(',')[0], scale: '0.33'}
        cfg = JSON.stringify(cfg)
        payload.bannerCfg = cfg
      }
    }
    await commonFetch(modShopStatus, payload)
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }
  
  const bannerStatus = computed({
    get(){
      if (shopInfo.value?.bannerStatus === 1) return true
      return false
    },
    set(val) {
      toModBannerStatus(val)
    }
  })
  
  const toBannerCfg = () => {
    router.push({name: 'banner-cfg', params: {shopId}})
  }

  const initVipInfo = async () => {
    const ret = await vipInfoManage.getData(shopId)
    vipInfo.value = ret[0]
  }

  const vipName = computed(() => {
    const {level} = vipInfo.value
    for (const item of E_vip_map) {
      if (item.level === level) return item.name
    }
    return ''
  })

  const expiredTimeDisplay = computed(() => {
    if (!vipInfo.value.expiredTime) return ''
    return dayjs(vipInfo.value.expiredTime * 1000).format('YYYY/MM/DD')
  })

  const displayRequiredType = computed(() => {
    const { requiredType } = shopInfo.value
    if (!requiredType) return '无'
    return getTypeName(requiredType)
  })

  const typeSelectDialogRef = ref()
  const handleRequiredType = async () => {
    const productType = await typeSelectDialogRef.value.getType(shopInfo.value.requiredType, '选择分类')
    await commonFetch(modShopStatus, {shopId, requiredType: productType})
    shopInfoManage.dirty(shopId)
    initShopInfo()
  }
  
  const init = async () => {
    const {rid} = globalData.value
    // if (![2,3,99].includes(rid)) {
    //   router.replace('home')
    // }
    initShopInfo()
    initVipInfo()
  }

  return {
    toModAlbum, toModStaff, toViewProtocol, init, globalData, toContactSys,
    isEncry, encryCode, shopInfo, refreshCode, toFeedback, isWaterMark, handleWaterMark,
    showVip, needAddress, inveExportStatus, toBannerCfg, bannerStatus, vipName, vipInfo,
    expiredTimeDisplay, isShowVip, displayRequiredType, handleRequiredType, typeSelectDialogRef
  }

}