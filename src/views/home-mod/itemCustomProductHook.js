

import { ref, computed } from 'vue'
import { showConfirmDialog } from 'vant';

export const useItemCustomProduct = (props, emits) => {
  const MAX_PRODUCTS = 5;
  
  const listDisplay = computed({
    get() {
      return props.config?.list || []
    },
    set(newList) {
      emits('update:config', { ...props.config, list: newList })
    }
  })

  // 上移方法
  const moveUp = (index) => {
    if (index === 0) return
    const newList = [...listDisplay.value]
    const temp = newList[index]
    newList[index] = newList[index - 1]
    newList[index - 1] = temp
    listDisplay.value = newList
  }

  // 下移方法
  const moveDown = (index) => {
    const listLen = listDisplay.value.length
    if (index === listLen - 1) return
    const newList = [...listDisplay.value]
    const temp = newList[index]
    newList[index] = newList[index + 1]
    newList[index + 1] = temp
    listDisplay.value = newList
  }

  // 删除方法
  const deleteHandle = async (index) => {
    try {
      await showConfirmDialog({
        title: '提示',
        message: `确定要删除该产品吗？`
      })
      const newList = [...listDisplay.value]
      newList.splice(index, 1)
      listDisplay.value = newList
    } catch (error) {
      // cancel
    }
  }

  const customProductSelectDialogRef = ref()
  
  const addHandle = async () => {
    const selectedProducts = await customProductSelectDialogRef.value.show(
      listDisplay.value.map(item => item.id),
      MAX_PRODUCTS
    )
    if (selectedProducts && selectedProducts.length) {
      const newProducts = selectedProducts.filter(
        product => !listDisplay.value.some(item => item.id === product.id)
      )
      const newList = [...listDisplay.value, ...JSON.parse(JSON.stringify(newProducts))]
      listDisplay.value = newList
    }
  }

  return {
    data: computed(() => ({ list: listDisplay.value })),
    moveUp, moveDown, deleteHandle, addHandle, customProductSelectDialogRef, MAX_PRODUCTS
  }
}
