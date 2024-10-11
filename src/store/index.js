import { ref, computed } from 'vue'
import { getProductTypes } from '@/http'


export const globalData = ref({
  userId: '123', // todo
  productTypes: {},
  done: false, // 是否初始化完成
  ownerList: [5], // 我创建的图册 todo
  adminList: [6], // 我管理的图册 todo
  editStatus: 0, // 编辑状态，0-非编辑、1-编辑中
  productManageNeedUpdate:  false, // 商品列表是否需要更新，比如修改商品后此属性应为 true
  getProductTypes: (shopId) => {
    shopId = +shopId
    return computed(() => {
      let res = globalData.value.productTypes?.[shopId]
      if (!res?.length) {
        fetchProductTypes(shopId)
        res = []
      }
      res = [{name: '全部',id: 0}, ...res]
      return res
    })
  }
})

export const fetchProductTypes = async (shopId) => {
  const {data} = await getProductTypes({shopId})
  if (data?.length) globalData.value.productTypes[shopId] = data
}

// todo
window.globalData = globalData