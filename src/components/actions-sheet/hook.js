import {ref} from 'vue'
import { sleep } from '@/util'

export const useActionsSheet = (emits) => {
  const isShow = ref(false)
  
  const show = () => {
    isShow.value = true
  }

  const selectHandle = async (item) => {
    isShow.value = false
    await sleep(100)
    emits('select', item)
  }

  return {
    show,
    isShow,
    selectHandle
  }
}