import {ref} from 'vue'

export const useActionsSheet = (emits) => {
  const isShow = ref(false)
  
  const show = () => {
    isShow.value = true
  }

  const selectHandle = async (item) => {
    isShow.value = false
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 100);
    })
    emits('select', item)
  }

  return {
    show,
    isShow,
    selectHandle
  }
}