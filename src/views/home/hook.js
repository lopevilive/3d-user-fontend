import { useRouter, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { globalLoading, viewLog, shopInfoManage} from '@/util'
import { globalData } from '@/store'



export const useHome = () => {
  const route = useRoute()
  const router = useRouter()

  const inited = ref(false)
  const gbLoading = globalLoading.getRef()
  const loading = computed(() => {
    if (inited.value) return false
    return gbLoading.value
  })

  const mineList = ref([])
  // 获取我创建/管理的画册
  const getMineList = async () => {
    const {ownerList = [], adminList = [], demoShops = []} = globalData.value?.userInfo
    let list = [...ownerList, ...adminList]
    list = list.filter((item) => {
      if (demoShops.includes(item)) return false
      return true
    })
    if (list.length) {
      let data = await shopInfoManage.getData(list)
      data = data || []
      mineList.value = data.sort((a) => {
        if (ownerList.includes(a.id)) return -1
        return 1
      })
    }
  }
  
  
  const demoList = ref([])
  // 获取案例画册
  const getDemoList = async () => {
    const {ownerList = [], adminList = [], demoShops = []} = globalData.value?.userInfo
    if (globalData.value.rid !== 99) {
      if (adminList.length || ownerList.length) return
    }
    if (demoShops.length) {
      const data = await shopInfoManage.getData(demoShops)
      demoList.value = data
    }
  }
  

  const logList = ref([])
  // 获取最近浏览的画册
  const getLogList = async () => {
    let logIds = viewLog.getlog()
    if (logIds.length) {
      const data = await shopInfoManage.getData(logIds)
      logList.value = data
    }
  }

  const preHandle = async () => {
    const pageCount = +sessionStorage.getItem('pageCount')
    if (pageCount !== 1) return true
    if (route.query?.noRedict) return true

    const {ownerList = [], adminList = [], viewLogs = []} = globalData.value?.userInfo
    if (ownerList.length === 1 && adminList.length === 0) {
      router.push({name: 'product-manage', params: {shopId: ownerList[0]}})
      return false
    }
    if (adminList.length === 1 && ownerList.length === 0) {
      router.push({name: 'product-manage', params: {shopId: adminList[0]}})
      return false
    }
    if (viewLogs.length === 1 && ownerList.length === 0 && adminList.length === 0) {
      router.push({name: 'product-manage', params: {shopId: viewLogs[0]}})
      return false
    }
    return true
  }

  const isShowCreate = computed(() => {
    if (globalData.value?.userInfo?.ownerList?.length) return false
    return true
  })

  const toAlbum = () => {
    router.push({name: 'album-mod'})
  }
  
  const init = async () => {
    try {
      globalData.value.editStatus = 0;
      globalData.value.productNeedExec = []
      const pass = await preHandle()
      if (!pass) return
      getMineList()
      getLogList()
      getDemoList()
    } finally {
      inited.value = true
    }
  }

  
  return {
    loading,
    init,
    mineList,
    demoList,
    logList,
    isShowCreate,
    toAlbum
  }
}