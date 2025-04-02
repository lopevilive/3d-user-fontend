import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, getProduct, productMod, getInventory } from '@/http'
import { commonFetch, EE, globalLoading, shopInfoManage, getImageUrl, sleep, getFlexW } from '@/util'
import { globalData } from '@/store'
import axios from 'axios';
import { showConfirmDialog } from 'vant';

export const useProductManage = () => {
  const router = useRouter()
  const route = useRoute()
  const shopId = +route.params.shopId
  let source = axios.CancelToken.source()
  const globalLoadingRef = globalLoading.getRef()
  const scrollT = ref(0)
  const listRef = ref()
  const finished = ref(false)

  const total = ref(0) // 总产品数
  const limit = ref(0) // 产品上限
  const unCateNum = ref(0) // 未分类数量
  const downNum = ref(0) // 下架数量

  const fetchLoadingRaw = ref(false)
  const fetchLoading = computed(() => {
    if (globalLoadingRef.value) return false
    return fetchLoadingRaw.value
  })
  const pageSize = 10
  const currPage = ref(0)
  const searchStr = ref('')

  const shopInfo = ref({})
  const activeTab = ref(0)
  const selectedList = ref([]) // 多选的项
  const priceSort = ref(0)

  const leftList = ref([])
  const rightList = ref([])
  const leftListRef = ref()
  const rightListRef = ref()

  const productTypes = computed(() => {
    const {rid} = globalData.value
    let ret = []
    for (const item of globalData.value.productTypes) {
      if (!item.parentId) ret.push(item)
    }
    let allName = '全部'
    if (rid === 99) {
      allName += `(${total.value}/${limit.value})`
    }
    if ([2,3].includes(rid)) {
      if (total.value > 25 || limit.value > 50) {
        allName += `(${total.value}/${limit.value})`
      }
    }
    ret.splice(0,0, {name: allName, id: 0})
    if ([2,3,99].includes(rid)) {
      let name1 = '未分类'
      if (unCateNum.value) {
        name1 += `(${unCateNum.value})`
      }
      let name2 = '已下架'
      if(downNum.value) {
        name2 += `(${downNum.value})`
      }
      ret.push({name: name1, id: -1})
      ret.push({name: name2, id: -2})
    }
    return ret
  })

  const subActiveTab = ref(0)
  const subTypesList = computed(() => {
    let ret = []
    for (const item of globalData.value.productTypes) {
      if (!activeTab.value) continue
      if (item.parentId === activeTab.value) ret.push(item)
    }
    if (ret.length) {
      ret.splice(0,0, {name: '全部', id: 0})
    }
    return ret
  })

  const beforeSubChange = (id) => {
    if (subActiveTab.value === 0 && id === 0) return
    if (subActiveTab.value === id) {
      subActiveTab.value = 0
    } else {
      subActiveTab.value = id
    }
    refresh()
  }

  let updateTitStatus = 1 //  0-完成设置title、大于0-未完成
  const setTitle = () => {
    if (updateTitStatus === 0) return
    const {name, url} = shopInfo.value
    if (!name) return
    updateTitStatus -= 1
    if (updateTitStatus > 0) return
    if (route.query?.title) return
    router.replace({name: 'product-manage', params: route.params, query: {
      title: name,
      imageUrl: getImageUrl(url?.split(',')?.[0] || '')
    }})
  }

  const fetchShop = async (updateTit = true) => {
    const res = await shopInfoManage.getData(shopId)
    if (res?.[0]) shopInfo.value = res[0]
    updateTit && setTitle()
  }


  class ListManage {
    constructor() {
      this.taskList = []
      this.runing = false
      this.cacheList = []
    }

    async exe () {
      this.runing = true
      while(this.taskList.length) {
        let nums = 2
        if (leftList.value.length === 0) nums = 7
        const list = this.taskList.splice(0, nums)
        handleRes(list)
        await sleep(200)
      }
      this.runing = false
    }

    add(list) {
      for (const item of list) {
        this.taskList.push(item)
        this.cacheList.push(item)
      }
      if (!this.runing) this.exe()
    }

    clear() {
      this.taskList = []
      this.cacheList = []
    }

  }

  const listManage = new ListManage()

  const handleRes = async (list) => {
    let leftIdx = 0
    let rightIdx = 0
    const lH = parseInt(window.getComputedStyle(leftListRef.value).height) // 左列表高度
    const rH =  parseInt(window.getComputedStyle(rightListRef.value).height) // 右列表高度
    const total = leftList.value.length + rightList.value.length
    const aver = (lH + rH) / total // 平均每个产品的高度
    const gap = Math.abs(rH - lH) // 左右高度差
    let num =  gap / aver
    if (isNaN(num)) num = 0
    if (num === 1) num = 0
    num = Math.floor(num)
    if (!num) num = 0
    if (lH > rH) {
      rightIdx += (num + 1)
    } else {
      leftIdx += num
    }
    for (const item of list) {
      if (leftIdx >= rightIdx) {
        leftList.value.push(item)
        rightIdx += 1
      } else {
        rightList.value.push(item)
        leftIdx += 1
      }
    }
  }

  const formatType = () => {
    let ret = `${activeTab.value}`
    if (subTypesList.value.length) ret += `-${subActiveTab.value}`
    return ret
  }
  
  let preSearchStr = ''
  const getPayload = () => {
    preSearchStr = searchStr.value
    let ret = {
      shopId,
      pageSize,
      currPage: currPage.value,
      productType: formatType(),
      status: 0,
      searchStr: searchStr.value || '',
      priceSort: priceSort.value
    }
    if (activeTab.value === -2) { // 已下架
      ret.productType = '0'
      ret.status = 1
    }
    return ret
  }

  
  const loadHandle = async () => {
    console.log('load')
    const payload = getPayload()
    try {
      fetchLoadingRaw.value = true
      const {data} = await getProduct(payload, {cancelToken: source.token})
      if (data.finished) finished.value = data.finished
      total.value = data.total
      limit.value = data.limit
      unCateNum.value = data.unCateNum
      downNum.value = data.downNum
      currPage.value += 1
      // let ret = []
      // new Array(100).fill(0).map(() => {
      //   ret = [...ret, ...data.list]
      // })
      // listManage.add(ret)
      listManage.add(data.list)
      setTimeout(() => {
        fetchLoadingRaw.value = false
      }, 0);
    }catch(e) {
      fetchLoadingRaw.value = false
      console.error(e)
    }
  }

  const tabChangeHandle = () => {
    subActiveTab.value = 0
    refresh()
  }

  const refresh = () => {
    currPage.value = 0
    finished.value = false
    leftList.value = []
    rightList.value = []
    selectedList.value = []
    listManage.clear()
    source.cancel()
    source = axios.CancelToken.source()
    loadHandle()
  }

  const searchBlurHadle = () => {
    if (preSearchStr === searchStr.value) return
    if (searchStr.value) {
      activeTab.value = 0
      subActiveTab.value = 0
    }
    refresh()
  }

  const scrollHandle = (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    scrollT.value = scrollTop
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 100){
      if (finished.value) return
      if (fetchLoadingRaw.value) return
      loadHandle()
    }
  }

  const selectedHandle = ({id, val}) => {
    const idx = selectedList.value.findIndex((item) => item === id)
    if (val) {
      if (idx === -1) selectedList.value.push(id)
    } else {
      if (idx === -1) return
      selectedList.value.splice(idx, 1)
    }
  }

  const removeAllSelected = () => {
    EE.emit('removeAllSelected')
  }

  const tabKey = ref(Math.floor(Math.random() * 100))
  const handleEditDone = async () => {
    removeAllSelected()
    await nextTick()
    globalData.value.editStatus = 0
    // tabKey.value = Math.floor(Math.random() * 100)
    // if (activeTab.value < 0) {
    //   activeTab.value = 0
    //   refresh()
    // }
  }

  const addProdHandle = async () => {
    await handleEditDone()
    router.push({name: 'product-edit' })
  }

  const removeList = (ids) => {
    leftList.value = leftList.value.filter((item) => {
      if (ids.includes(item.id)) return false
      return true
    })
    rightList.value = rightList.value.filter((item) => {
      if (ids.includes(item.id)) return false
      return true
    })
  }

  const handleMulOnOff = async (mod) => {
    const act = mod === 'on' ? '上架' : '下架'
    await showConfirmDialog({
      title: `批量${act}`,
      message: `确定${act}所选产品吗？当前选中 ${selectedList.value.length} 个产品`
    })
    await commonFetch(productMod, {id: selectedList.value, status: mod === 'on' ? 0 : 1, shopId})
    let num = mod === 'on' ? -selectedList.value.length : selectedList.value.length
    downNum.value += num;
    downNum.value = downNum.value ? downNum.value : 0
    removeList(selectedList.value)
    removeAllSelected()
  }

  const handleMulDel = async () => {
    await showConfirmDialog({
      title: '批量删除',
      message: `确定删除所选产品吗？当前选中 ${selectedList.value.length} 个产品`
    })
    await commonFetch(productDel, {id: selectedList.value, shopId})
    const len = selectedList.value.length;
    removeList(selectedList.value)
    removeAllSelected()
    if (activeTab.value === -1) {
      unCateNum.value -= len;
      unCateNum.value = unCateNum.value ? unCateNum.value : 0;
    }
    if (activeTab.value === -2) {
      downNum.value -= len;
      downNum.value = downNum.value ? downNum.value : 0;
    }
  }

  const execList = (refList, newItem) => {
    let matched = false
    let idx = refList.value.findIndex((item) => item.id === newItem.id)
    if (idx !== -1) {
      matched = true
      const oldItem = refList.value[idx]
      if (newItem.status !== oldItem.status) { // 上/下架
        refList.value.splice(idx, 1)
        return matched
      }
      if (activeTab.value === -1) {
        if (newItem.productType) {
          refList.value.splice(idx, 1)
          return matched
        }
      }
      if (activeTab.value > 0) {
        if (+newItem.productType !== activeTab.value) {
          refList.value.splice(idx, 1)
          return matched
        }
      }
      refList.value[idx] = newItem
    }
    return matched

  }

  const updateProd = async (list) => {
    if ([1,2].includes(priceSort.value)) {
      refresh()
      return
    }
    const idList = [...list]
    const res = await commonFetch(getProduct, {shopId, productId: idList})
    if (!res?.list?.length) return
    total.value = res.total
    limit.value = res.limit
    unCateNum.value = res.unCateNum
    downNum.value = res.downNum

    for (const newItem of res.list) {
      let matched = execList(leftList, newItem)
      if (matched) continue
      matched = execList(rightList, newItem)
      if (matched === false) {
        refresh()
        return
      }
    }
  }

  const mulPriceRef = ref()
  const handleMulPrice = async () => {
    const price = await mulPriceRef.value.getPrice()
    await commonFetch(productMod, {price, id: selectedList.value, shopId})
    updateProd(selectedList.value)
    removeAllSelected()
  }

  const mulProductTypeRef = ref()
  const handleMulChangeType = async () => {
    const productType = await mulProductTypeRef.value.getType()
    await commonFetch(productMod, {productType, id: selectedList.value, shopId})
    // if (activeTab.value === -1) {
    //   if (productType) {
    //     unCateNum.value -= selectedList.value.length;
    //     unCateNum.value = unCateNum.value ? unCateNum.value : 0;
    //   }
    // }
    // if ([0,-2].includes(activeTab.value)) {
    //   removeAllSelected()
    //   return
    // }
    // if (productType !== activeTab.value) {
    //   removeList(selectedList.value)
    // }
    refresh()
    removeAllSelected()
  }

  const getPreIdx = (preId) => {
    let idx = 0
    let firstNoSortId
    for (const item of listManage.cacheList) {
      if (item.sort > 0) {
        idx += 1
        continue
      }
      firstNoSortId = item.id
      break
    }
    if (preId === 0) return idx
    const curIdx = listManage.cacheList.findIndex((item) => item.id === preId)
    if (curIdx === -1) return -1
    let ret = Math.max(curIdx, idx)
    return ret + 1
  }
  
  const handlePosChange = (data) => {
    const {id, preId, type} = data
    const idx = listManage.cacheList.findIndex((item) => item.id === id)
    if (idx === -1) return
    const currItem = listManage.cacheList.splice(idx, 1)[0]
    let preIdx = getPreIdx(preId)
    if (preIdx !== -1) {
      listManage.cacheList.splice(preIdx, 0, currItem)
    }
    leftList.value = []
    rightList.value = []
    let num = 0
    for (const item of listManage.cacheList) {
      if ((num % 2) === 0) {
        leftList.value.push(item)
      } else {
        rightList.value.push(item)
      }
      num += 1
    }

  }
  
  const handleUpdate = async ({type, data}) => {
    if (type === 'sort') { // 置顶/取消置顶
      refresh()
    }
    if (type === 'del') { // 删除
      removeList([data.id])
      if (activeTab.value === -2) {
        downNum.value -= 1
        downNum.value = downNum.value ? downNum.value: 0
      } else if (!data.productType) {
        unCateNum.value -= 1
        unCateNum.value = unCateNum.value ? unCateNum.value : 0
      }
    }
    if (type === 'edit') {
      if (data.id === 0) {
        refresh()
        return
      }
      updateProd([data.id])
    }
    if (type === 'status') {
      refresh()
    }
    if (type === 'pos') {
      handlePosChange(data)
    }
  }

  const activeHandle = () => {
    fetchShop(false)
    tabKey.value = Math.floor(Math.random() * 100)
    if (scrollT.value) {
      listRef.value.scrollTop = scrollT.value
    }
    if (globalData.value?.productNeedExec?.length) {
      let tmpList = globalData.value.productNeedExec
      globalData.value.productNeedExec = []
      for (const item of tmpList) {
        if (['sort'].includes(item.type)) {
          handleUpdate(item)
          return
        }
      }
      const execPayload = tmpList.pop()
      handleUpdate(execPayload)
    }
  }

  const priceSortChangeHandle = async () => {
    refresh()
  }

  const formatInventory = async () => {
    const {userInfo: {userId}} = globalData.value
    if (!userId) return
    const data = await commonFetch(getInventory, {shopId, userId, limit: 5})
    if (data.length) globalData.value.hasInventory[shopId] = true
  }

  const isShowSort = computed(() => {
    if ([1,2].includes(priceSort.value)) {
      return false
    }
    return true
  })

  const stickyPos = computed(() => {
    if (globalData.value.editStatus !== 1) return 0
    return getFlexW(51)
  })

  const isShowBanner = computed(() => {
    if (globalData.value.editStatus === 1) return false
    if (shopInfo.value.bannerStatus !== 1) return false
    return true
  })

  const bannerCfg = computed(() => {
    const info = JSON.parse(shopInfo.value.bannerCfg)
    return {
      imgList: info.url.split(','),
      scale: info.scale
    }
  })
  
  const type1PopRef = ref()
  const type1PopClickHandle = async () => {
    const ret = await type1PopRef.value.show()
    if (ret === activeTab.value) return
    activeTab.value = ret
    tabChangeHandle()
  }

  const type2PopRef = ref()
  const type2PopClickHandle = async () => {
    const ret = await type2PopRef.value.show()
    beforeSubChange(ret)
  }
  
  const init = async () => {
    globalData.value.productNeedExec = []
    const {toDetial, title, imageUrl} = route.query
    if (toDetial) {
      updateTitStatus += 1
      router.replace({name: 'product-manage',  params: {shopId}})
      await sleep(300)
      router.push({name: 'product-detial', params: {id: toDetial}, query: {title, imageUrl}})
    }
    loadHandle()
    fetchShop()
    formatInventory()
  }

  return {
    init, productTypes, activeTab, loadHandle, finished, fetchLoading, refresh,
    tabChangeHandle, leftList, rightList, leftListRef, rightListRef, scrollHandle,
    selectedList, selectedHandle, removeAllSelected, handleEditDone, addProdHandle,
    handleMulOnOff, handleMulDel, handleMulPrice, handleMulChangeType, mulPriceRef,
    mulProductTypeRef, listRef, handleUpdate, tabKey, activeHandle, searchStr, searchBlurHadle,
    scrollT, priceSort, priceSortChangeHandle, subTypesList, subActiveTab, bannerCfg,
    beforeSubChange, formatType, isShowSort, shopInfo, stickyPos, isShowBanner, type1PopRef,
    type1PopClickHandle, type2PopRef, type2PopClickHandle
  }
}