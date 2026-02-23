import { ref, computed } from 'vue'
import { formatType } from '@/util'
import { globalData } from '@/store'
import { showToast, showConfirmDialog } from 'vant';

export const useItemProductType = (props, emits) => {
  const listDisplay = computed({
    get() {
      return props.config?.list || []
    },
    set(newList) {
      emits('update:config', { ...props.config, list: newList })
    }
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
    for (const item of listDisplay.value) {
      if (item.typeId === ret.typeId) {
        showToast('已存在该分类～')
        return
      }
    }
    const newList = [...listDisplay.value, ret]
    listDisplay.value = newList
  }

  // 上移方法：当前项与前一项交换位置
  const moveUp = (index) => {
    if (index === 0) return // 边界防护：第一个项无法上移
    const newList = [...listDisplay.value]
    const temp = newList[index]
    newList[index] = newList[index - 1]
    newList[index - 1] = temp
    listDisplay.value = newList
  }

  // 下移方法：当前项与后一项交换位置
  const moveDown = (index) => {
    const listLen = listDisplay.value.length
    if (index === listLen - 1) return // 边界防护：最后一个项无法下移
    const newList = [...listDisplay.value]
    const temp = newList[index]
    newList[index] = newList[index + 1]
    newList[index + 1] = temp
    listDisplay.value = newList
  }

  const deleteHandle = async (index) => {
    try {
      // await showConfirmDialog({
      //   title: '删除分类',
      //   message: `确定删除【${getTypeName(listDisplay.value[index].typeId)}】?`
      // })
      // 确认后删除对应项，splice保证Vue3响应式更新
      const newList = [...listDisplay.value]
      newList.splice(index, 1)
      listDisplay.value = newList
    } catch (error) {
      // 取消删除时捕获异常，无任何操作（与你项目代码风格一致）
    }
  }

  const uploadImgsRefs = ref([])
  const valid = async () => {
    for (const item of uploadImgsRefs.value) {
      if (item && item.isLoading) return '请等待图片上传完成再保存～'
    }
  }

  return {
    addHandle, productTypeSelectDialogRef, getTypeName, moveUp, moveDown, deleteHandle, listDisplay,
    uploadImgsRefs, valid
  }
}