import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, getProduct, getShop } from '@/http'
import { commonFetch } from '@/util'
import {globalData} from '@/store'
import axios from 'axios';

export const useProductItem = (emits) => {
  const router = useRouter()
  const isShow = ref(false)

  const actions = [
    {
      name: '修改',
      action: (data) => {
        const {id} = data
        router.push({name: 'product-edit', params: {id}})
      }
    },
    {
      name: '删除',
      action: async (data) => {
        const {id} = data
        await commonFetch(productDel, {id})
        globalData.value.productManageNeedUpdate = true
        emits('update')
      }
    },
    {
      name: '置顶',
      action: () => {}
    },
    {
      name: '前移'
    }
  ]

  const selectHandle = (item, data) => {
    isShow.value = false
    const {action} = item
    action(data)
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
  const pageSize = 6
  const currPage = ref(0)

  const prodcutList = ref([])
  const shopInfo = ref({})
  const activeTab = ref(0)
  const productTypes = globalData.value.getProductTypes(shopId)

  const fetchShop = async () => {
    const res = await commonFetch(getShop, {shopId})
    if (res?.[0])shopInfo.value = res[0]
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
      fetchLoading.value = false
      if (data.finished) finished.value = data.finished
      currPage.value += 1
      prodcutList.value = [...prodcutList.value, ...data.list]
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
    prodcutList.value = []
    source.cancel()
    source = axios.CancelToken.source()
    loadHandle()
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
    prodcutList,
    loadHandle,
    finished,
    fetchLoading,
    activedHandle,
    tabChangeHandle
  }
}