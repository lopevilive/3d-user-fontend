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
  },
  productTypes: {},
  editStatus: 0, // 编辑状态，0-非编辑、1-编辑中
  productManageNeedUpdate:  false, // 产品列表是否需要更新，比如修改产品后此属性应为 trueå
  _productTypes: {},
  productTypes: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    if (!shopId) return []
    let res = globalData.value._productTypes?.[shopId]
    if (!res?.length) {
      upDateProductTypes(shopId)
      res = []
    }
    return res
  }),
  rid: computed(() => {
    const route = router.currentRoute.value
    const shopId = +route.params.shopId
    const {userInfo} = globalData.value
    if (userInfo.isSup) return 99 // 超级管理员
    const {ownerList, adminList, userId} = userInfo
    if (ownerList?.includes(shopId)) return 3 // 图册创建者
    if (adminList?.includes(shopId)) return 2 // 图册管理员
    if (userId) return 1 // 登录状态
    return 0 // 游客
  }),
})

export const upDateProductTypes = async (shopId) => {
  const {data} = await getProductTypes({shopId})
  if (data?.length) globalData.value._productTypes[shopId] = data
}

export const initProductTypes = () => {
  globalData.value._productTypes = {}
}

// todo
window.globalData = globalData