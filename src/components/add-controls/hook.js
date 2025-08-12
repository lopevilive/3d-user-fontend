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

  return {
    isShow, carInfo, specAddRef, specClickHandle
  }

}