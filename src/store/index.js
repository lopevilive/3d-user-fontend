import { ref, computed } from 'vue'
import { getProductTypes } from '@/http'


export const globalData = ref({
  userInfo: {
    // userId: 123, 
    // ownerList: [5,1], // 我创建的图册
    // adminList: [6], // 我管理的图册 
  }, 
  productTypes: {},
  editStatus: 0, // 编辑状态，0-非编辑、1-编辑中
  productManageNeedUpdate:  false, // 产品列表是否需要更新，比如修改产品后此属性应为 true
  getProductTypes: (shopId, all = true) => {
    shopId = +shopId
    return computed(() => {
      let res = globalData.value.productTypes?.[shopId]
      if (!res?.length) {
        upDateProductTypes(shopId)
        res = []
      }
      if (all) {
        res = [{name: '全部',id: 0}, ...res]
      }
      return res
    })
  }
})

export const upDateProductTypes = async (shopId) => {
  const {data} = await getProductTypes({shopId})
  if (data?.length) globalData.value.productTypes[shopId] = data
}

export const initProductTypes = () => {
  globalData.value.productTypes = {}
}

// todo
window.globalData = globalData