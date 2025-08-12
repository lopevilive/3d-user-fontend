import { ref, computed } from 'vue'
import { getAddressList } from '@/http'
import { commonFetch, productTypesManage } from '@/util'
import router from '@/router/index.js'

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
  _productTypes: {},
  productTypes: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    if (!shopId) return []
    if (!globalData.value._productTypes?.[shopId]) {
      globalData.value._productTypes[shopId] = {done: false, data: null}
    }
    const matched = globalData.value._productTypes?.[shopId]
    if (!matched.done) {
      matched.done = true
      productTypesManage.getData(shopId)
        .then((ret) => {
          matched.data = ret[0]?.list || []
        })
        .catch((err) => {
          matched.data = []
        })
    }
    return matched.data || []
  }),
  rid: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    const {userInfo} = globalData.value
    if (userInfo.isSup) return 99 // 超级管理员
    const {ownerList, adminList, userId, hasPhone} = userInfo
    if (ownerList?.includes(shopId)) return 3 // 图册创建者
    if (adminList?.includes(shopId)) return 2 // 图册管理员
    if (hasPhone) return 10 // 实名手机
    if (userId) return 1 // 登录状态
    return 0 // 游客
  }),
  _addressList: {done: false, data: null},
  addressList: computed(() => {
    const {data, done} = globalData.value._addressList
    if (!done) {
      globalData.value._addressList.done = true
      commonFetch(getAddressList)
        .then((res) => {
          globalData.value._addressList.data = res.map((item) => {
            item.isDefault = !!item.isDefault
            return item
          })
        })
        .catch((err) => {
          console.error(err)
          globalData.value._addressList.data = null
        })
    }
    return data || []
  }),
  selectedAddress: [],
  invertoryRemark: '',
  isPC: false, // 是否 pc 打开
  wxEnv: 'release',
  encryInfo: {},
  hasInventory: {},
  cusInventoryNeedUpdate: false,
  prodManageNeedUpdate: false,
  prodEditNeedAlive: false, // 编辑产品页面是否需要 alive
  specEditNeedAlive: false, // 编辑规格页是否需要 alive
})


export * from './shopCarManage'


// todo
window.globalData = globalData