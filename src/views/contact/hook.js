import { ref, computed } from 'vue'
import { getShop } from '@/http'
import { commonFetch } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import copy from 'copy-to-clipboard';
import { showSuccessToast } from 'vant';
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

  const copyStr = (str) => {
    const res = copy(str)
    if (res) showSuccessToast('复制成功～')
  }

  const init = async () => {
    const res = await commonFetch(getShop, {shopId})
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
    if (shopInfo.value.phone) return true
    if (shopInfo.value.qrcodeUrl) return true
    return false
  })

  const isShowToEdit = computed(() => {
    if (isShowConcat.value) return false
    const {rid} = globalData.value
    if ([2,3,99].includes(rid)) return true
    return false
  })

  const toEdit = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  return {
    shopInfo,
    init,
    imgList,
    addressDisplay,
    copyStr,
    toViewQr,
    isShowConcat,
    isShowToEdit,
    toEdit
  }
}