import {ref} from 'vue'

export const useActionsSheet = (emits) => {
  const isShow = ref(false)
  
  const show = () => {
    isShow.value = true
  }

  const selectHandle = (item) => {
    emits('select', item)
    isShow.value = false
  }

  return {
    show,
    isShow,
    selectHandle
  }
}