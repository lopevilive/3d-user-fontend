import {ref, computed} from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/http'
import { commonFetch, E_model3D } from '@/util'
import {globalData} from '@/store'


export const useProductDetial = () => {
  const route = useRoute()
  const {id: productId, shopId} = route.params

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

  const shareGuideRef = ref()
  const shareHandle = () => {
    shareGuideRef.value.showGuide()
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
    shareGuideRef,
    shareHandle,
    displayAttrs
  }
}