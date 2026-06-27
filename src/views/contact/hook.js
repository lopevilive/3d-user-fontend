import { ref, computed } from 'vue'
import { shopInfoManage, isInApp, getImageUrl } from '@/util'
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

  const dialogImgsRef = ref()
  const toViewQr = () => {
    const inApp = isInApp()
    const {qrcodeUrl, name} = shopInfo.value
    const url = getImageUrl(qrcodeUrl)
    if (inApp) {
      const payload = { qrcodeUrl: url, message: `长按识别二维码～` }
      let payloadStr = encodeURIComponent(JSON.stringify(payload))
      wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
    } else {
      dialogImgsRef.value.show([url])
    }
  }

  const isShowConcat = computed(() => {
    if (shopInfo.value.phone) return true
    if (shopInfo.value.qrcodeUrl) return true
    return false
  })

  const isShowToEdit = computed(() => {
    if (shopInfo.value.showContact === 1) return false
    if (isShowConcat.value) return false
    if (isShowAddress.value) return false
    const {rid} = globalData.value
    if ([2,3,99].includes(rid)) return true
    return false
  })

  const toEdit = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const isShowAddress = computed(() => {
    if (shopInfo.value.address) return true
    return false
  })

  const init = async () => {
    const res = await shopInfoManage.getData(shopId)
    shopInfo.value = res[0]
  }

  return {
    shopInfo, init, imgList, addressDisplay, toViewQr, isShowConcat, isShowToEdit, toEdit, isShowAddress, dialogImgsRef
  }
}