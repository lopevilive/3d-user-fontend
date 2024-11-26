import {ref, computed} from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/http'
import { commonFetch, isInApp, getImageUrl } from '@/util'


export const useProductDetial = () => {
  const route = useRoute()
  const productId = +route.params.id
  const shopId = +route.params.shopId

  const info = ref({})
  const modelDisplayRef = ref()

  const imgList = computed(() => {
    const {url} = info.value
    if (!url) return []
    return url.split(',')
  })

  const displayAttrs = computed(() => {
    let attr = info.value?.attr || '[]'
    attr = JSON.parse(attr)
    return attr
  })

  const handleView3D = () => {
    modelDisplayRef.value.showModelDisplay()
  }

  const shareHandle = async () => {
    const inApp = await isInApp()
    const payload = {
      url: getImageUrl(info.value.url.split(',')[0]),
      title: info.value.desc,
      productId,
      shopId
    }
    if (inApp) {
      wx.miniProgram.navigateTo({url: `../share/share?payload=${encodeURIComponent(JSON.stringify(payload))}`})
    }
  }

  const init = async () => {
    if (!productId) return
    const data = await commonFetch(getProduct, {productId})
    if (data.list.length) {
      info.value = data.list[0]
    }
  }

  return {
    info,
    imgList,
    handleView3D,
    init,
    modelDisplayRef,
    shareHandle,
    displayAttrs
  }
}