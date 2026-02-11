import { ref, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { showConfirmDialog } from 'vant';
import { getProduct } from '@/http'
import { commonFetch } from '@/util'

export const useItemCustomProduct = (props, emits) => {
  const route = useRoute()
  const shopId = +route.params.shopId
  
  const MAX_PRODUCTS = 8;
  
  const prodInfo = ref({})
  // 新增：待请求的商品ID队列（去重）
  const pendingProductIds = ref(new Set())
  // 新增：防抖定时器，避免频繁发起请求
  let debounceTimer = null
  // 防抖延时（可根据业务调整，比如300ms）
  const DEBOUNCE_DELAY = 100

  // 新增：批量请求商品数据的核心函数
  const fetchBatchProducts = async () => {
    // 无待请求ID则直接返回
    if (pendingProductIds.value.size === 0) return
    
    // 1. 提取队列中的ID并清空队列
    const ids = Array.from(pendingProductIds.value)
    pendingProductIds.value.clear()
    
    // 2. 标记这些ID的请求状态为“请求中”
    ids.forEach(id => {
      if (!prodInfo.value[id]) {
        prodInfo.value[id] = { status: 0, data: null }
      }
      prodInfo.value[id].status = 1
    })

    try {
      // 3. 批量请求商品数据（productId传数组）
      const res = await commonFetch(getProduct, { shopId, productId: ids })
      // 4. 遍历返回结果，更新缓存
      if (res?.list?.length) {
        res.list.forEach(item => {
          prodInfo.value[item.id] = { status: 2, data: item }
        })
      }

      // 5. 处理请求成功但无数据的ID（标记为完成，data为null）
      ids.forEach(id => {
        if (prodInfo.value[id].status === 1) { // 仍处于请求中状态的ID
          prodInfo.value[id].status = 2
        }
      })
    } catch (error) {
      // 6. 请求失败时，标记所有ID为“请求完成”
      ids.forEach(id => {
        if (prodInfo.value[id]) {
          prodInfo.value[id].status = 2
        }
      })
      console.error('批量获取商品信息失败：', error)
    }
  }

  // 修改：原getProdInfo改为收集ID到队列，触发防抖请求
  const getProdInfo = (id) => {
    if (!id) return
    // 初始化缓存项（仅初始化，不发起请求）
    if (!prodInfo.value[id]) {
      prodInfo.value[id] = { status: 0, data: null }
    }
    // 已请求中/已完成的ID，不加入队列
    if (prodInfo.value[id].status === 1 || prodInfo.value[id].status === 2) return
    
    // 将ID加入待请求队列
    pendingProductIds.value.add(id)
    
    // 防抖：清空原有定时器，重新计时
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      fetchBatchProducts()
    }, DEBOUNCE_DELAY)
  }

  const prodInfoDisplay = computed({
    get() {
      const ret = []
      let propsList = props.config?.list || []
      for (const { id } of propsList) {
        const matchedItem = prodInfo.value[id]
        if (matchedItem && matchedItem.status === 2 && matchedItem.data) {
          ret.push(matchedItem.data)
        } else {
          getProdInfo(id)
        }
      }
      return ret
    },
    set(newList) {
      emits('update:config', { ...props.config, list: newList })
    }
  })

  const moveUp = (index) => {
    if (index === 0) return
    const newList = [...props.config.list]
    const temp = newList[index]
    newList[index] = newList[index - 1]
    newList[index - 1] = temp
    prodInfoDisplay.value = newList
  }

  const moveDown = (index) => {
    const listLen = props.config.list.length
    if (index === listLen - 1) return
    const newList = [...props.config.list]
    const temp = newList[index]
    newList[index] = newList[index + 1]
    newList[index + 1] = temp
    prodInfoDisplay.value = newList
  }

  const deleteHandle = async (index) => {
    try {
      await showConfirmDialog({
        title: '提示',
        message: `确定要删除该产品吗？`
      })
      const newList = [...props.config.list]
      newList.splice(index, 1)
      prodInfoDisplay.value = newList
    } catch (error) {
      // cancel
    }
  }

  const customProductSelectDialogRef = ref()
  const addHandle = async () => {
    const ids = props.config.list.map((item) => item.id)
    const selectedProducts = await customProductSelectDialogRef.value.show(ids, MAX_PRODUCTS)
    const newList = []
    for (const rawItem of props.config.list) {
      const idx = selectedProducts.findIndex((item) => item.id === rawItem.id)
      if (idx === -1) continue
      newList.push({ id: rawItem.id })
    }

    for (const selectedItem of selectedProducts) {
      const idx = newList.findIndex((item) => item.id === selectedItem.id)
      if (idx !== -1) continue
      newList.push({ id: selectedItem.id })
      prodInfo.value[selectedItem.id] = { data: selectedItem, status: 2 }
    }
    prodInfoDisplay.value = newList
  }

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    moveUp, moveDown, deleteHandle, addHandle, customProductSelectDialogRef, MAX_PRODUCTS,
    prodInfoDisplay
  }
}