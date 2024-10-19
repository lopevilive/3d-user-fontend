import {ref, computed} from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/http'
import { commonFetch, E_model3D } from '@/util'
import {globalData} from '@/store'


export const useProductDetial = () => {
  const route = useRoute()
  const {id: productId, shopId} = route.params

  const info = ref({})
  const productTypes = globalData.value.getProductTypes(shopId)
  const modelDisplayRef = ref()

  const imgList = computed(() => {
    const {url} = info.value
    if (!url) return []
    return url.split(',')
  })

  const descDisplay = computed(() => {
    let ret = []
    for (const key of Object.keys(info.value)) {
      let val = info.value[key]
      if (!val) continue;
      if (key === 'desc') {
        ret.push({label: '产品描述', val})
      }
      if (key === 'productType') {
        val = +val
        for (const item of productTypes.value) {
          if (item.id === val) {
            ret.push({label: '产品类别', val: item.name})
          }
        }
      }
    }
    return ret
  })

  const insideDesc = computed(() => {
    let ret = []
    for (const key of Object.keys(info.value)) {
      let val = info.value[key]
      if (!val) continue;
      if (key === 'type3D') {
        if (val === 1) {
          for (const item of E_model3D) {
            if (item.key === info.value.model3D) {
              ret.push({label: '720°全景', val: `自动生成-${item.val}`})
            }
          }
        }
        if (val === 2) {
          ret.push({label: '720°全景', val: '二维码链接'})
        }
      }
    }
    return ret
  })

  const handleView3D = () => {
    modelDisplayRef.value.showModelDisplay()
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
    descDisplay,
    handleView3D,
    init,
    modelDisplayRef,
    insideDesc
  }
}