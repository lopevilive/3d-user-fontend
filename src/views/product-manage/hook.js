import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, getProduct, getShop, moveTopProduct, productMod } from '@/http'
import { commonFetch, EE } from '@/util'
import { globalData } from '@/store'
import axios from 'axios';
import { showConfirmDialog } from 'vant';

export const useProductItem = (props, emits) => {
  const router = useRouter()
  const route = useRoute()

  const isShow = ref(false)
  const shopId = + route.params.shopId

  const actions = [
    {
      name: '修改产品',
      // icon: 'edit',
      color: '#52b4f8',
      action: () => {
        const {id} = props.data
        router.push({name: 'product-edit', params: {id}})
      }
    },
    {
      name: '移到最前',
      // icon: 'back-top',
      action: async () => {
        const {id} = props.data
        await commonFetch(moveTopProduct, {id, shopId})
        globalData.value.productManageNeedUpdate = true
        emits('update')
      }
    },
    {
      name: '下架产品',
      // icon: 'edit',
      color: '#f29b73',
      action: async () => {
        const {id, name} = props.data
        await showConfirmDialog({
          title: '下架产品',
          message: `确定下架【${name}】?`
        })
        await commonFetch(productMod, {id, status: 1})
        globalData.value.productManageNeedUpdate = true
        emits('update')
      }
    },
    {
      name: '删除产品',
      // icon: 'delete-o',
      color: '#ee0a24',
      action: async () => {
        const {id, name} = props.data
        await showConfirmDialog({
          title: '删除产品',
          message: `确定删除【${name}】?`
        })
        await commonFetch(productDel, {id})
        globalData.value.productManageNeedUpdate = true
        emits('update')
      }
    },
    
  ]

  const selectHandle = (item) => {
    isShow.value = false
    const {action} = item
    action()
  }

  const  settingClickHandle = () => {
    isShow.value = true
  }

  const handleClick = () => {
    const {id} = props.data
    if (globalData.value.editStatus === 1) {
      router.push({name: 'product-edit', params: {id}})
    } else {
      router.push({name: 'product-detial', params: {id}})
    }
  }

  const urlDisplay = computed(() => {
    const {url} = props.data
    if (!url) return ''
    return url.split(',')[0]
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

  return {
    actions,
    isShow,
    selectHandle,
    settingClickHandle,
    handleClick,
    urlDisplay,
    checked,
    changeHandle,
  }
}

export const useProductManage = () => {
  const router = useRouter()
  const route = useRoute()
  const shopId = +route.params.shopId
  let source = axios.CancelToken.source()

  const finished = ref(false)
  const fetchLoading = ref(false)
  const pageSize = 10
  const currPage = ref(0)

  const shopInfo = ref({})
  const activeTab = ref(0)
  const selectedList = ref([]) // 多选的项

  const leftList = ref([])
  const rightList = ref([])
  const leftListRef = ref()
  const rightListRef = ref()
  let leftIdx = 0
  let rightIdx = 0

  const productTypesRaw = globalData.value.getProductTypes(shopId)
  const productTypes = computed(() => {
    let ret = [...productTypesRaw.value]
    ret.splice(1,0, {name:'未分类', id: -1})
    ret.splice(2,0, {name:'已下架', id: -2})
    return ret
  })

  const fetchShop = async () => {
    const res = await commonFetch(getShop, {shopId})
    if (res?.[0])shopInfo.value = res[0]
  }

  const handleRes = (list) => {
    const itemH = window.innerWidth
    const lH = parseInt(window.getComputedStyle(leftListRef.value).height)
    const rH =  parseInt(window.getComputedStyle(rightListRef.value).height)
    const gap = Math.abs(rH - lH)
    const num =  Math.floor(gap / itemH)
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

  const getPayload = () => {
    let ret = {
      shopId,
      pageSize,
      currPage: currPage.value,
      productType: activeTab.value,
      status: 0,
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
      fetchLoading.value = true
      const {data} = await getProduct(payload, {cancelToken: source.token})
      if (data.finished) finished.value = data.finished
      currPage.value += 1
      handleRes(data.list)
      setTimeout(() => {
        fetchLoading.value = false
      }, 0);
    }catch(e) {
      fetchLoading.value = false
      console.error(e)
    }
  }

  const tabChangeHandle = () => {
    globalData.value.productManageNeedUpdate = true
    activedHandle()
  }

  const activedHandle = () => {
    if (globalData.value.productManageNeedUpdate === false) return
    globalData.value.productManageNeedUpdate = false
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

  const scrollHandle = (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 10){
      if (finished.value) return
      if (fetchLoading.value) return
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

  const handleEditDone = async () => {
    removeAllSelected()
    await nextTick()
    globalData.value.editStatus = 0
  }

  const addProdHandle = async () => {
    await handleEditDone()
    router.push({name: 'product-edit' })
  }

  const handleMulOnOff = async (mod) => {
    const act = mod === 'on' ? '上架' : '下架'
    await showConfirmDialog({
      title: `批量${act}`,
      message: `确定${act}所选产品吗？当前选中 ${selectedList.value.length} 个产品。`
    })
    await commonFetch(productMod, {id: selectedList.value, status: mod === 'on' ? 0 : 1})
    globalData.value.productManageNeedUpdate = true
    activedHandle()
  }

  const handleMulDel = async () => {
    await showConfirmDialog({
      title: '批量删除',
      message: `确定删除所选产品吗？当前选中 ${selectedList.value.length} 个产品。`
    })
    await commonFetch(productDel, {id: selectedList.value})
    globalData.value.productManageNeedUpdate = true
    activedHandle()
  }

  const mulPriceRef = ref()
  const handleMulPrice = async () => {
    const price = await mulPriceRef.value.getPrice()
    await commonFetch(productMod, {price, id: selectedList.value})
    globalData.value.productManageNeedUpdate = true
    activedHandle()
  }

  const mulProductTypeRef = ref()
  const handleMulChangeType = async () => {
    const productType = await mulProductTypeRef.value.getType()
    await commonFetch(productMod, {productType, id: selectedList.value})
    globalData.value.productManageNeedUpdate = true
    activedHandle()
  }

  const init = async () => {
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
    activedHandle,
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
    mulProductTypeRef
  }
}