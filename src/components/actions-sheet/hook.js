import {ref} from 'vue'
import { sleep } from '@/util'

export const useActionsSheet = (props, emits) => {
  const isShow = ref(false)
  
  const show = () => {
    isShow.value = true
  }

  const close = () => {
    isShow.value = false
  }

  const selectHandle = async (item) => {
    if (props.autoClose) isShow.value = false
    await sleep(100)
    emits('select', item)
  }

  return {
    show,
    isShow,
    selectHandle,
    close
  }
}