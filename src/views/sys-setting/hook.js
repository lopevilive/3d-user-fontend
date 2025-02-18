import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { encryAlbum, getEncryCode, updateEncryCode, modWaterMark as modWaterMarkCgi } from '@/http'
import { toContactSys, shopInfoManage, commonFetch } from '@/util'
import { showConfirmDialog } from 'vant';

export const useSysSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = +route.params.shopId

  const shopInfo = ref({})
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

  const modWaterMark = async (val) => {
    if (val) {

    }
    await commonFetch(modWaterMarkCgi, {shopId, waterMark: val ? 1: 0})
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

  const initShopInfo = async () => {
    let info = await shopInfoManage.getData(shopId)
    shopInfo.value = info[0]
    if (isEncry.value) {
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

  const init = async () => {
    const {rid} = globalData.value
    // if (![2,3,99].includes(rid)) {
    //   router.replace('home')
    // }
    initShopInfo()
    
  }

  return {
    toModAlbum,
    toModStaff,
    toViewProtocol,
    init,
    globalData,
    toContactSys,
    isEncry,
    encryCode,
    shopInfo,
    refreshCode,
    toFeedback,
    isWaterMark,
    handleWaterMark
  }

}