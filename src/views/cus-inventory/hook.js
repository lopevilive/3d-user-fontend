import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCusInventory, modInventoryStatus, getInventory, exportInventoryV3 } from '@/http'
import { commonFetch } from '@/util'
import { showConfirmDialog, showToast } from 'vant';
import { globalData } from '@/store';


export const useCusInventory = () => {

  const route = useRoute()
  const shopId = + route.params.shopId
  let inited = false;

  const isMulEdit = ref(false)
  const finished = ref(false)
  const scrollT = ref(0)
  const fetchLoadingRaw = ref(false)
  const dataList = ref([])
  const selectedItems = ref(new Set()) // 存储选中的项目ID

  const currPage = ref(0)
  const pageSize = 10
  const active = ref(2)
  const timeS = ref('')
  const timeE = ref('')
  const keyword = ref('')

  const showStatusSelect = ref(false)

  const selectAll = computed({
    get() {
      if (selectedItems.value.size === dataList.value.length) return true
      return false
    },
    set(checked) {
      if (checked) {
        dataList.value.forEach(item => {
          selectedItems.value.add(item.id)
        })
      } else {
        selectedItems.value.clear()
      }
    }
  })

  const tabOptions = [
    { text: '待处理', value: 2 },
    { text: '已完成', value: 3 },
    { text: '已取消', value: 4 },
    { text: '全部', value: 1 },
  ]

  const statusDisplay = computed(() => {
    if (!active.value) return '请选择'
    const selected = tabOptions.find((item) => item.value === active.value)
    return selected ? selected.text : '请选择'
  })

  const getPayload = () => {
    const ret = {shopId, pageSize, currPage: currPage.value}
    if (active.value === 2) ret.status = 0
    if (active.value === 3) ret.status = 1
    if (active.value === 4) ret.status = 2
    let str = keyword.value.replace(/\s/g, '');
    if (str) ret.keyword = str
    if (timeS.value) {
      const date = new Date(Number(timeS.value))
      date.setHours(0, 0, 0, 0)
      ret.timeS = Math.floor(date.getTime() / 1000)
    }
    if (timeE.value) {
      const date = new Date(Number(timeE.value))
      date.setHours(23, 59, 59, 999)
      ret.timeE = Math.floor(date.getTime() / 1000)
    }

    // 校验时间范围
    if (ret.timeS && ret.timeE && ret.timeE <= ret.timeS) {
      throw new Error('结束时间必须大于开始时间')
    }
    return ret
  }
  
  const loadData = async () => {
    let payload
    try {
      payload = getPayload()
    }catch (e) {
      e.message && showToast(e.message)
      return
    }
    fetchLoadingRaw.value = true
    const ret = await commonFetch(getCusInventory, payload)
    fetchLoadingRaw.value = false
    finished.value = ret.finished;
    for (const item of ret.list) {
      dataList.value.push(item)
    }
  }

  const updateInventory = async (id) => {
    // 统一按数组处理
    const ids = Array.isArray(id) ? id : [id]
    const data = await commonFetch(getInventory, {id: ids})
    if (data && data.length) {
      data.forEach(updatedItem => {
        const idx = dataList.value.findIndex((item) => item.id === updatedItem.id)
        if (idx !== -1) {
          dataList.value[idx] = updatedItem
        }
      })
    }
  }
  
  const cancelHandle = async (id) => {
    await showConfirmDialog({message: '确定取消该清单？'})
    await commonFetch(modInventoryStatus, {shopId, id, status: 2})
    updateInventory(id)
  }

  const finishHandle = async (id) => {
    await showConfirmDialog({message: '确定完成该清单？'})
    await commonFetch(modInventoryStatus, {shopId, id, status: 1})
    updateInventory(id)
  }
  
  const scrollHandle = async (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    scrollT.value = scrollTop
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 100){
      if (finished.value) return
      if (fetchLoadingRaw.value) return
      currPage.value += 1
      loadData()
    }
  }

  const listRef = ref()
  const activeHandle = () => {
    if (scrollT.value) {
      listRef.value.scrollTop = scrollT.value
    }
    if (inited) {
      if (globalData.value.inventoryNeedExec.length) {
        const id = globalData.value.inventoryNeedExec.pop()
        globalData.value.inventoryNeedExec = []
        updateInventory(id)
      }
      if (globalData.value.cusInventoryNeedUpdate) {
        resetHandle()
      }
    }
    globalData.value.cusInventoryNeedUpdate = false
  }

  const resetHandle = async () => {
    active.value = 2
    timeS.value = ''
    timeE.value = ''
    keyword.value = ''
    selectAll.value = false
    searchHandle()
  }
  
  const searchHandle = async ()=> {
    currPage.value = 0
    dataList.value = []
    finished.value = false
    selectAll.value = false
    loadData()
  }

  const mulHandle = async () => {
    isMulEdit.value = !isMulEdit.value
    if (!isMulEdit.value) {
      // 退出多选模式时清空选择
      selectedItems.value.clear()
      selectAll.value = false
    }
  }

  // 处理单个项目选择
  const handleItemSelect = (id, checked) => {
    if (checked) {
      selectedItems.value.add(id)
    } else {
      selectedItems.value.delete(id)
    }
  }

  const isShowBatchExport = computed(() => {
    if (['release'].includes(globalData.value.wxEnv)) return false
    if (selectedItems.value.size > 0) return true
    return false
  })

  const isShowBatchFinish = computed(() => {
    if (selectedItems.value.size > 0) return true
    return false
  })

  const isShowBatchCancel = computed(() => {
    if (selectedItems.value.size > 0) return true
    return false
  })
  
  const batchFinishHandle = async () => {
    if (selectedItems.value.size === 0) {
      showToast('请先选择要完成的清单')
      return
    }
    await showConfirmDialog({
      message: `确定完成选中的 ${selectedItems.value.size} 个清单吗？`
    })
    const ids = Array.from(selectedItems.value)
    await commonFetch(modInventoryStatus, { shopId, id: ids, status: 1 })
    selectedItems.value.clear()
    updateInventory(ids)
  }

  const batchCancelHandle = async () => {
    if (selectedItems.value.size === 0) {
      showToast('请先选择要取消的清单')
      return
    }
    await showConfirmDialog({
      message: `确定取消选中的 ${selectedItems.value.size} 个清单吗？`
    })
    const ids = Array.from(selectedItems.value)
    await commonFetch(modInventoryStatus, { shopId, id: ids, status: 2 })
    selectedItems.value.clear()
    updateInventory(ids)
  }
  
  const batchExportHandle = async () => {
    const ids = Array.from(selectedItems.value)
    const ret = await commonFetch(exportInventoryV3, {id: ids, shopId})
    const payloadStr = encodeURIComponent(JSON.stringify(ret))
    wx.miniProgram.navigateTo({
      url:`../download-page/downloadPage?payload=${payloadStr}`
    })
    console.log(ret)
  }
  
  const init = async () => {
    await loadData()
    inited = true
  }

  return {
    init, active, dataList, cancelHandle, finishHandle, scrollHandle, listRef, activeHandle, timeS,
    timeE, keyword, tabOptions,statusDisplay, showStatusSelect, searchHandle, resetHandle, isMulEdit,
    mulHandle, selectedItems, selectAll, handleItemSelect, isShowBatchExport, isShowBatchFinish,
    isShowBatchCancel, batchFinishHandle, batchCancelHandle, batchExportHandle
  }
}