import {ref, nextTick} from 'vue'

export const useActionsSheet = (emits) => {
  const isShow = ref(false)
  
  const show = () => {
    isShow.value = true
  }

  const selectHandle = async (item) => {
    isShow.value = false
    await nextTick()
    emits('select', item)
  }

  return {
    show,
    isShow,
    selectHandle
  }
}