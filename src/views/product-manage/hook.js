import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, getProduct, getShop, moveTopProduct, productMod } from '@/http'
import { commonFetch, EE, globalLoading, getImageUrl } from '@/util'
import { globalData } from '@/store'
import axios from 'axios';
import { showConfirmDialog } from 'vant';

export const useProductItem = (props, emits) => {
  const router = useRouter()
  const route = useRoute()

  const isShow = ref(false)
  const shopId = + route.params.shopId

  const actions = computed(() => {
    const {status, sort} = props.data
    let ret = [
      {
        name: '修改产品',
        color: '#5794f7',
        action: () => {
          const {id} = props.data
          router.push({name: 'product-edit', params: {id}})
        }
      },
    ];

    if (status === 0) {
      if (sort !== 0) {
        ret.push({
          name: '取消置顶',
          color: '#f29b73',
          action: async () => {
            const {id} = props.data
            await commonFetch(productMod, {id, shopId, sort: 0})
            emits('update', {type: 'sort', data: props.data})
          }
        })
      } else {
        ret.push({
          name: '置顶产品',
          color: '#5794f7',
          action: async () => {
            const {id} = props.data
            await commonFetch(moveTopProduct, {id, shopId})
            emits('update', {type: 'sort', data: props.data})
          }
        })
      }
      
    }

    const act = status === 0 ? '下架' : '上架'
    const color = status === 0 ? '#f29b73' : '#58bd6b'
    ret.push({
      name: `${act}产品`,
      color,
      action: async () => {
        const {id} = props.data
        await showConfirmDialog({
          title: `${act}产品`,
          message: `确定要${act}该产品吗?`
        })
        await commonFetch(productMod, {id, status: status === 0 ? 1 : 0, shopId})
        emits('update', {type: 'status', data: props.data})
      }
    })
    ret.push({
      name: '删除产品',
      // icon: 'delete-o',
      color: '#ee0a24',
      action: async () => {
        const {id} = props.data
        await showConfirmDialog({
          message: `确定要删除这个产品吗?`
        })
        await commonFetch(productDel, {id, shopId})
        emits('update', {type: 'del', data: props.data})
      }
    })
    return ret
  })

  const selectHandle = (item) => {
    isShow.value = false
    const {action} = item
    action()
  }

  const  settingClickHandle = () => {
    isShow.value = true
  }

  const handleClick = () => {
    const {id, desc} = props.data

    if (globalData.value.editStatus === 1) {
      router.push({name: 'product-edit', params: {id}})
    } else {
      router.push({
        name: 'product-detial',
        params: {id},
        query: {title: desc, imageUrl: urlDisplay.value},
      })
    }
  }

  const urlDisplay = computed(() => {
    const {url} = props.data
    if (!url) return ''
    return getImageUrl(url.split(',')[0])
  })

  const checked = ref(false)

  const changeHandle = (val) => {
    const {id} = props.data
    emits('selected', {id, val})
  }

  const removeChecked = () => {
    checked.value = false
    changeHandle(false)
  }

  EE.on('removeAllSelected', removeChecked)

  onUnmounted(() => {
    EE.removeListener('removeAllSelected', removeChecked)
  })

  const displayAttrs = computed(() => {
    let attr = props.data.attr || '[]'
    attr = JSON.parse(attr)
    let str = ''
    for(const item of attr) {
      if (!item.val) continue
      if (['其他'].includes(item.val)) continue
      if (str) str += ' | '
      str += item.val
    }
    return str
  })

  const isShowSticky = computed(() => {
    const {rid} = globalData.value
    if (![2,3,99].includes(rid)) return false
    if (props.data?.sort > 0) return true
    return false
  })

  return {
    actions,
    isShow,
    selectHandle,
    settingClickHandle,
    handleClick,
    urlDisplay,
    checked,
    changeHandle,
    displayAttrs,
    isShowSticky
  }
}

export const useProductManage = () => {
  const router = useRouter()
  const route = useRoute()
  const shopId = +route.params.shopId
  let source = axios.CancelToken.source()
  const globalLoadingRef = globalLoading.getRef()
  const scrollT = ref(0)
  const listRef = ref()
  const finished = ref(false)
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

  const leftList = ref([])
  const rightList = ref([])
  const leftListRef = ref()
  const rightListRef = ref()
  let leftIdx = 0
  let rightIdx = 0

  const productTypes = computed(() => {
    const {rid} = globalData.value
    let ret = [...globalData.value.productTypes]
    ret.splice(0,0, {name: '全部', id: 0})
    if ([2,3,99].includes(rid)) {
      ret.push({name:'未分类', id: -1})
      ret.push({name:'已下架', id: -2})
    }
    return ret
  })

  const fetchShop = async () => {
    const res = await commonFetch(getShop, {shopId})
    if (res?.[0])shopInfo.value = res[0]
  }

  const handleRes = (list) => {
    const lH = parseInt(window.getComputedStyle(leftListRef.value).height) // 左列表高度
    const rH =  parseInt(window.getComputedStyle(rightListRef.value).height) // 右列表高度
    const total = leftList.value.length + rightList.value.length
    const aver = (lH + rH) / total // 平均每个产品的高度
    const gap = Math.abs(rH - lH) // 左右高度差
    let num =  Math.floor(gap / aver)
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

  let preSearchStr = ''
  const getPayload = () => {
    preSearchStr = searchStr.value
    let ret = {
      shopId,
      pageSize,
      currPage: currPage.value,
      productType: activeTab.value,
      status: 0,
      searchStr: searchStr.value || ''
    }
    if (activeTab.value === -2) { // 已下架
      ret.productType = 0
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
      currPage.value += 1
      handleRes(data.list)
      setTimeout(() => {
        fetchLoadingRaw.value = false
      }, 0);
    }catch(e) {
      fetchLoadingRaw.value = false
      console.error(e)
    }
  }

  const tabChangeHandle = () => {
    refresh()
  }

  const refresh = () => {
    currPage.value = 0
    finished.value = false
    leftList.value = []
    rightList.value = []
    selectedList.value = []
    leftIdx = 0
    rightIdx = 0
    source.cancel()
    source = axios.CancelToken.source()
    loadHandle()
  }

  const searchBlurHadle = () => {
    if (preSearchStr === searchStr.value) return
    refresh()
  }


  const flexibleHRaw = (window.innerWidth * 42) / 375
  const flexibleH = ref(flexibleHRaw)
  const preScrollTop = ref(0)

  const handleFlexible = (scrollTop, clientHeight, scrollHeight) => {
    if (scrollTop <= 0) {
      preScrollTop.value = 0
      flexibleH.value = flexibleHRaw
      return
    }

    const range = scrollTop - preScrollTop.value
    preScrollTop.value = scrollTop

    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (a >= b) {
      flexibleH.value = 0
      return
    }
    // if (Math.abs(b - a) < 10){
    //   flexibleH.value = 0
    //   return
    // }

    let h = flexibleH.value - range
    if (h <= 0) h = 0
    if (h > flexibleHRaw) h = flexibleHRaw
    if (h === flexibleH.value) return
    flexibleH.value = h
  }

  const scrollHandle = (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    handleFlexible(scrollTop, clientHeight, scrollHeight)
    scrollT.value = scrollTop
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 10){
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

  const removeList = () => {
    leftList.value = leftList.value.filter((item) => {
      if (selectedList.value.includes(item.id)) return false
      return true
    })
    rightList.value = rightList.value.filter((item) => {
      if (selectedList.value.includes(item.id)) return false
      return true
    })
    removeAllSelected()
  }

  const handleMulOnOff = async (mod) => {
    const act = mod === 'on' ? '上架' : '下架'
    await showConfirmDialog({
      title: `批量${act}`,
      message: `确定${act}所选产品吗？当前选中 ${selectedList.value.length} 个产品`
    })
    await commonFetch(productMod, {id: selectedList.value, status: mod === 'on' ? 0 : 1, shopId})
    removeList()
  }

  const handleMulDel = async () => {
    await showConfirmDialog({
      title: '批量删除',
      message: `确定删除所选产品吗？当前选中 ${selectedList.value.length} 个产品`
    })
    await commonFetch(productDel, {id: selectedList.value, shopId})
    removeList()
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
    const idList = [...list]
    const res = await commonFetch(getProduct, {shopId, productId: idList})
    if (!res?.list?.length) return

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
    if ([0,-2].includes(activeTab.value)) {
      return removeAllSelected()
    }
    if (productType !== activeTab.value) {
      return removeList()
    }
    removeAllSelected()
  }

  const handleUpdate = async ({type, data}) => {
    if (type === 'sort') { // 置顶/取消置顶
      refresh()
    }
    if (['status', 'del'].includes(type)) { // 上架/下架/删除
      leftList.value = leftList.value.filter((item) => {
        if (item.id === data.id) return false
        return true
      })
      rightList.value = rightList.value.filter((item) => {
        if (item.id === data.id) return false
        return true
      })
    }
    if (type === 'edit') {
      if (data.id === 0) {
        refresh()
        return
      }
      updateProd([data.id])
    }
  }

  const activeHandle = () => {
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

  const init = async () => {
    globalData.value.productNeedExec = []
    const {toDetial} = route.query
    if (toDetial) {
      router.push({name: 'product-detial', params: {id: toDetial}})
    }
    loadHandle()
    fetchShop()
  }

  return {
    init,
    productTypes,
    activeTab,
    loadHandle,
    finished,
    fetchLoading,
    refresh,
    tabChangeHandle,
    leftList,
    rightList,
    leftListRef,
    rightListRef,
    scrollHandle,
    selectedList,
    selectedHandle,
    removeAllSelected,
    handleEditDone,
    addProdHandle,
    handleMulOnOff,
    handleMulDel,
    handleMulPrice,
    handleMulChangeType,
    mulPriceRef,
    mulProductTypeRef,
    listRef,
    handleUpdate,
    tabKey,
    activeHandle,
    flexibleH,
    searchStr,
    searchBlurHadle
  }
}