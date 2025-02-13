import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { globalLoading, viewLog, shopInfoManage} from '@/util'
import { globalData } from '@/store'



export const useHome = () => {
  const router = useRouter()
  const loading = globalLoading.getRef()

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
      let data = await shopInfoManage.getShopInfo(list)
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
    const {demoShops = []} = globalData.value?.userInfo
    if (demoShops.length) {
      const data = await shopInfoManage.getShopInfo(demoShops)
      demoList.value = data
    }
  }
  

  const logList = ref([])
  // 获取最近浏览的画册
  const getLogList = async () => {
    const {ownerList = [], adminList = [], demoShops = []} = globalData.value?.userInfo
    let logIds = viewLog.getlog()
    logIds = logIds.reverse()
    let tmp = [...ownerList, ...adminList, ...demoShops]
    logIds = logIds.filter((item) => {
      if (tmp.includes(item)) return false
      return true
    })
    if (logIds.length) {
      const data = await shopInfoManage.getShopInfo(logIds)
      logList.value = data
    }
  }
  

  const preHandle = async () => {
    const pageCount = +sessionStorage.getItem('pageCount')
    if (pageCount !== 1) return true

    const {ownerList = [], adminList = []} = globalData.value?.userInfo
    if (ownerList.length === 1 && adminList.length === 0) {
      router.push({name: 'product-manage', params: {shopId: ownerList[0]}})
      return false
    }
    if (adminList.length === 1 && ownerList.length === 0) {
      router.push({name: 'product-manage', params: {shopId: adminList[0]}})
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
    globalData.value.editStatus = 0;
    globalData.value.productNeedExec = []
    const pass = await preHandle()
    if (!pass) return
    getMineList()
    getLogList()
    getDemoList()
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