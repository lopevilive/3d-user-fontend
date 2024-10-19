import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, getProduct, getShop, moveTopProduct } from '@/http'
import { commonFetch } from '@/util'
import {globalData} from '@/store'
import axios from 'axios';
import { showConfirmDialog } from 'vant';

export const useProductItem = (props, emits) => {
  const router = useRouter()
  const route = useRoute()

  const isShow = ref(false)
  const shopId = + route.params.shopId

  const actions = [
    {
      name: '移到最前',
      icon: 'back-top',
      action: async () => {
        const {id} = props.data
        await commonFetch(moveTopProduct, {id, shopId})
        globalData.value.productManageNeedUpdate = true
        emits('update')
      }
    },
    {
      name: '修改商品',
      icon: 'edit',
      color: '#52b4f8',
      action: () => {
        const {id} = props.data
        router.push({name: 'product-edit', params: {id}})
      }
    },
    {
      name: '删除商品',
      icon: 'delete-o',
      color: '#ee0a24',
      action: async () => {
        const {id, name} = props.data
        await showConfirmDialog({
          title: '删除商品',
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

  return {
    actions,
    isShow,
    selectHandle,
    settingClickHandle
  }
}

export const useProductManage = () => {
  const route = useRoute()
  const shopId = +route.params.shopId
  let source = axios.CancelToken.source()

  const finished = ref(false)
  const fetchLoading = ref(false)
  const pageSize = 10
  const currPage = ref(0)

  const shopInfo = ref({})
  const activeTab = ref(0)
  const productTypes = globalData.value.getProductTypes(shopId)

  const listRef = ref()

  const leftList = ref([])
  const rightList = ref([])
  const leftListRef = ref()
  const rightListRef = ref()
  let leftIdx = 0
  let rightIdx = 0

  const fetchShop = async () => {
    const res = await commonFetch(getShop, {shopId})
    if (res?.[0])shopInfo.value = res[0]
  }

  const handleRes = (list) => {
    const itemH = window.innerHeight / 3
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

  const loadHandle = async () => {
    console.log('load')
    const payload = {
      shopId,
      pageSize,
      currPage: currPage.value,
      productType: activeTab.value
    }
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


  const init = async () => {
    loadHandle()
    fetchShop()
  }

  return {
    init,
    productTypes,
    activeTab,
    shopInfo,
    loadHandle,
    finished,
    fetchLoading,
    activedHandle,
    tabChangeHandle,
    leftList,
    rightList,
    leftListRef,
    rightListRef,
    listRef,
    scrollHandle
  }
}