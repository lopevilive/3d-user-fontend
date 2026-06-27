import { computed, ref } from 'vue'
import { shopCarInstance, globalData } from '@/store'

export const useAddControls = (props) => {

  const specAddRef = ref()
  const carInfo = computed(() => {
    return shopCarInstance.getData(props.productInfo).value
  })

  const isShow = computed(() => {
    if (globalData.value.editStatus === 1) return false
    if (!props.productInfo) return false
    return true
  })

  const specClickHandle = async () => {
    specAddRef.value.show()
  }

  const isShowSingle = computed(() => {
    if (!globalData.value.userInfo?.userId) return false
    if (props.productInfo.isSpec === 0) return true
    return false
  })

  return {
    isShow, carInfo, specAddRef, specClickHandle, isShowSingle
  }

}