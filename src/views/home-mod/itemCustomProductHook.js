

import { ref } from 'vue'
import { showConfirmDialog } from 'vant';

export const useItemCustomProduct = () => {
  const MAX_PRODUCTS = 5;
  
  const data = ref({
    list: []
  })

  // 上移方法
  const moveUp = (index) => {
    if (index === 0) return
    const temp = data.value.list[index]
    data.value.list[index] = data.value.list[index - 1]
    data.value.list[index - 1] = temp
  }

  // 下移方法
  const moveDown = (index) => {
    const listLen = data.value.list.length
    if (index === listLen - 1) return
    const temp = data.value.list[index]
    data.value.list[index] = data.value.list[index + 1]
    data.value.list[index + 1] = temp
  }

  // 删除方法
  const deleteHandle = async (index) => {
    try {
      await showConfirmDialog({
        title: '提示',
        message: `确定要删除该产品吗？`
      })
      data.value.list.splice(index, 1)
    } catch (error) {
      // cancel
    }
  }

  const customProductSelectDialogRef = ref()
  
  const addHandle = async () => {
    const selectedProducts = await customProductSelectDialogRef.value.show(
      data.value.list.map(item => item.id),
      MAX_PRODUCTS
    )
    if (selectedProducts && selectedProducts.length) {
      const newProducts = selectedProducts.filter(
        product => !data.value.list.some(item => item.id === product.id)
      )
      data.value.list.push(...JSON.parse(JSON.stringify(newProducts)))
    }
  }

  return {
    data, moveUp, moveDown, deleteHandle, addHandle, customProductSelectDialogRef, MAX_PRODUCTS
  }
}
