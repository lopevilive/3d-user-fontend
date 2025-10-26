import { ref, computed } from 'vue'
import { shopInfoManage } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import {globalData} from '@/store'

export const useContact = () => {
  const route = useRoute()
  const shopId = +route.params.shopId
  const router = useRouter()
  
  const shopInfo = ref({})

  const imgList = computed(() => {
    const {url} = shopInfo.value
    if (!url) return []
    return url.split(',')
  })

  const addressDisplay = computed(() => {
    const {area, address} = shopInfo.value
    let str = ''
    if (area) str += area.replaceAll('\/', '')
    if (address) str+= address
    return str
  })

  const init = async () => {
    const res = await shopInfoManage.getData(shopId)
    shopInfo.value = res[0]
  }

  const toViewQr = () => {
    const {qrcodeUrl, name} = shopInfo.value
    const payload = {
      qrcodeUrl,
      message: `长按识别二维码～`
    }
    let payloadStr = encodeURIComponent(JSON.stringify(payload))
    wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
  }

  const isShowConcat = computed(() => {
    if (shopInfo.value.showContact === 1) return false
    if (shopInfo.value.phone) return true
    if (shopInfo.value.qrcodeUrl) return true
    return false
  })

  const isShowToEdit = computed(() => {
    if (shopInfo.value.showContact === 1) return false
    if (isShowConcat.value) return false
    const {rid} = globalData.value
    if ([2,3,99].includes(rid)) return true
    return false
  })

  const toEdit = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const isShowAddress = computed(() => {
    if (isShowConcat.value === false) return false
    if (!addressDisplay.value) return false
    return true
  })

  return {
    shopInfo,
    init,
    imgList,
    addressDisplay,
    toViewQr,
    isShowConcat,
    isShowToEdit,
    toEdit,
    isShowAddress
  }
}