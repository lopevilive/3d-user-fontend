import { computed, ref } from 'vue'
import { shopCarInstance, globalData } from '@/store'

export const useAddControls = (props) => {

  const carInfo = shopCarInstance.getData(props.productInfo).value

  const isShow = computed(() => {
    if (globalData.value.editStatus === 1) return false
    if (!props.productInfo) return false
    const { isSpec, price, specs } = props?.productInfo
    if (isSpec === 0) return true
    if (isSpec === 1 && specs) return true
    return false
  })

  const isShowSpecs = ref(false)

  const specsList = computed(() => {
    const { isSpec, specs } = props.productInfo
    if (isSpec !== 1) return []
    let ret = []
    const list = JSON.parse(specs || '[]')
    for (const item of list) {
      ret.push({
        name: item.name,
        price: item.price,
        data: shopCarInstance.getData(props.productInfo, item.name).value
      })
    }
    return ret
  })

  return {
    isShow,
    carInfo,
    isShowSpecs,
    specsList
  }

}