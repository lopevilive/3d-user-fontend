import { ref } from 'vue'
import { formatType } from '@/util'
import { globalData } from '@/store'
import { showToast, showConfirmDialog } from 'vant';

export const useItemProductType = () => {
  const data = ref({
    list: []
  })

  const getTypeName = (typeId) => {
    const { type1 } = formatType(typeId)
    for (const item of globalData.value.productTypes) {
      if (item.id === type1) return item.name
    }
    return ''
  }

  const productTypeSelectDialogRef = ref()
  const addHandle = async () => {
    const ret = await productTypeSelectDialogRef.value.show()
    for (const item of data.value.list) {
      if (item.typeId === ret.typeId) {
        showToast('已存在该分类～')
        return
      }
    }
    data.value.list.push(ret)
  }

  // 上移方法：当前项与前一项交换位置
  const moveUp = (index) => {
    if (index === 0) return // 边界防护：第一个项无法上移
    const temp = data.value.list[index]
    data.value.list[index] = data.value.list[index - 1]
    data.value.list[index - 1] = temp
  }

  // 下移方法：当前项与后一项交换位置
  const moveDown = (index) => {
    const listLen = data.value.list.length
    if (index === listLen - 1) return // 边界防护：最后一个项无法下移
    const temp = data.value.list[index]
    data.value.list[index] = data.value.list[index + 1]
    data.value.list[index + 1] = temp
  }

  const deleteHandle = async (index) => {
    try {
      await showConfirmDialog({
        title: '删除分类',
        message: `确定删除【${getTypeName(data.value.list[index].typeId)}】?`
      })
      // 确认后删除对应项，splice保证Vue3响应式更新
      data.value.list.splice(index, 1)
    } catch (error) {
      // 取消删除时捕获异常，无任何操作（与你项目代码风格一致）
    }
  }

  return {
    data, addHandle, productTypeSelectDialogRef, getTypeName, moveUp, moveDown, deleteHandle
  }
}