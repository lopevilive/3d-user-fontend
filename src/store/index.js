import { ref, computed } from 'vue'
import { getProductTypes } from '@/http'
import router from '@/router/index.js'

export const globalData = ref({
  userInfo: {
    // userId: 123,
    // ownerList: [5,1], // 我创建的图册
    // adminList: [6], // 我管理的图册
    // isSup: false, // 是否超级管理员
    // hasPhone: false, // 是否认证手机号
    // demoShops: [], // 案例图册
  },
  editStatus: 0, // 编辑状态，0-非编辑、1-编辑中
  productNeedExec: [], // 需要更新的产品
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
      getProductTypes({shopId})
        .then(({data}) => { matched.data = data })
        .catch((err) => { matched.data = []})
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
  _addressList: {},
  // addressList: 
})


export * from './shopCarManage'


// todo
window.globalData = globalData