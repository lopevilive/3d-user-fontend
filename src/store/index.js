import { ref, computed } from 'vue'
import { getAddressList, getUsage } from '@/http'
import { commonFetch, productTypesManage, getRidByShopId } from '@/util'
import router from '@/router/index.js'

const _productTypes = ref({})
const _addressList = ref({done: false, data: null})
const _usage = ref({})

export const globalData = ref({
  userInfo: {
    // userId: 123,
    // ownerList: [5,1], // 我创建的图册
    // adminList: [6], // 我管理的图册
    // isSup: false, // 是否超级管理员
    // hasPhone: false, // 是否认证手机号
    // demoShops: [], // 案例图册
    // viewLogs: [], // 浏览记录
  },
  editStatus: 0, // 编辑状态，0-非编辑、1-编辑中
  productNeedExec: [], // 需要更新的产品
  inventoryNeedExec: [], // 需要更新的清单
  isShowSke: false, // 是否展示骨架屏
  productTypes: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    if (!shopId) return []
    if (!_productTypes.value[shopId]) {
      _productTypes.value[shopId] = {done: false, data: null}
    }
    if (!_productTypes.value[shopId].done) {
      _productTypes.value[shopId].done = true
      productTypesManage.getData(shopId)
        .then((ret) => {
          _productTypes.value[shopId].data = ret[0]?.list || []
        })
        .catch((err) => {
          _productTypes.value[shopId].data = []
        })
    }
    return _productTypes.value[shopId].data || []
  }),
  dirtyProductTypes: (shopId) => {
    if (! _productTypes.value[shopId])  return
    _productTypes.value[shopId].done = false
  },
  rid: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    const {userInfo} = globalData.value
    const ret = getRidByShopId(shopId, userInfo)
    return ret
  }),
  addressList: computed(() => {
    if (!_addressList.value.done) {
      _addressList.value.done = true
      commonFetch(getAddressList)
        .then((res) => {
          _addressList.value.data = res.map((item) => {
            item.isDefault = !!item.isDefault
            return item
          })
        })
        .catch((err) => {
          console.error(err)
          _addressList.value.data = null
        })
    }
    return _addressList.value.data || []
  }),
  dirtyAddressList: () => {
    _addressList.value.done = false
  },
  selectedAddress: [],
  invertoryRemark: '',
  isPC: false, // 是否用电脑打开小程序
  wxEnv: 'release', // develop trial release
  encryInfo: {},
  hasInventory: {},
  cusInventoryNeedUpdate: false,
  prodManageNeedUpdate: false,
  prodEditNeedAlive: false, // 编辑产品页面是否需要 alive
  specEditNeedAlive: false, // 编辑规格页是否需要 alive
  homePageStatus: {}, // 用来记录是否已经展示了首页
  getFooterBarRef: () => {},
  customHomeNeedUpdate: false,
  homeModNeedAlive: false, // 首页配置页是否需要 alive
  currViewProd: null, // 当前查看的产品
  usage: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    if (!shopId) return {}
    if (!_usage.value[shopId]) {
      _usage.value[shopId] = {done: false, data: null}
    }
    if (!_usage.value[shopId].done) {
      _usage.value[shopId].done = true
      commonFetch(getUsage, {shopId})
        .then((res) => {
          _usage.value[shopId].data = res
        })
        .catch((err) => {
          console.error(err)
          _usage.value[shopId].data = null
        })
    }
    return _usage.value[shopId].data || {}
  }),
  dirtyUsage: (shopId) => {
    if (!_usage.value[shopId]) return
    _usage.value[shopId].done = false
  }
})
 

export * from './shopCarManage'


window.globalData = globalData