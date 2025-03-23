import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCusInventory, modInventoryStatus, getInventory } from '@/http'
import { commonFetch } from '@/util'
import { showConfirmDialog } from 'vant';
import { globalData } from '@/store';


export const useCusInventory = () => {

  const route = useRoute()
  const shopId = + route.params.shopId
  let inited = false;

  const finished = ref(false)
  const scrollT = ref(0)
  const fetchLoadingRaw = ref(false)
  const currPage = ref(0)
  const pageSize = 10
  const active = ref(1)
  const dataList = ref([])
  
  const getPayload = () => {
    const ret = {shopId, pageSize, currPage: currPage.value}
    if (active.value === 1) ret.status = 0
    if (active.value === 2) ret.status = 1
    if (active.value === 3) ret.status = 2
    return ret
  }
  
  const loadData = async () => {
    const payload = getPayload()
    fetchLoadingRaw.value = true
    const ret = await commonFetch(getCusInventory, payload)
    fetchLoadingRaw.value = false
    finished.value = ret.finished;
    for (const item of ret.list) {
      dataList.value.push(item)
    }
  }

  const updateInventory = async (id) => {
    const idx = dataList.value.findIndex((item) => item.id === id)
    if (active.value !== 0) {
      if (idx !== -1) {
        dataList.value.splice(idx, 1)
      }
    } else {
      const data = await commonFetch(getInventory, {id})
      if (data.length) {
        dataList.value[idx] = data[0]
      }
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

  const tabChangeHandle = () => {
    currPage.value = 0
    dataList.value = []
    finished.value = false
    loadData()
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
        tabChangeHandle()
      }
    }
    globalData.value.cusInventoryNeedUpdate = false
  }
  
  const isShowMulHandle = computed(() => {
    if (active.value !== 1) return false
    if (dataList.value.length === 0) return false
    return true
  })
  
  const cancelAllHandle = async () => {
    await showConfirmDialog({message: '确定取消全部清单？'})
    await commonFetch(modInventoryStatus, {shopId, isAll: true, status: 2})
    tabChangeHandle()
  }

  const finishAllHandle = async () => {
    await showConfirmDialog({message: '确定完成全部清单？'})
    await commonFetch(modInventoryStatus, {shopId, isAll: true, status: 1})
    tabChangeHandle()
  }
  
  const init = async () => {
    await loadData()
    inited = true
  }

  return {
    init, active, dataList, cancelHandle, finishHandle, tabChangeHandle, scrollHandle,
    listRef, activeHandle, isShowMulHandle, cancelAllHandle, finishAllHandle
  }
}