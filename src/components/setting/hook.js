import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/sotre/index.js'

export const useSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId

  const actions = [
    {
      name: '图册管理',
      action: () => {
        router.push({name: 'album-mod', params: {id: shopId}})
      }
    },
    {
      name: '商品管理',
      action: () => {
        globalData.value.editStatus = 1;
      }
    },
    {
      name: '新增商品',
      action: () => {
        router.push({name: 'product-edit'})
      }
    },
    {
      name: '分类管理',
      action: () => {
        router.push({name: 'type-manage'})
      }
    }
  ]

  const isShow = computed(() => {
    const {ownerList, adminList, editStatus} = globalData.value
    if (editStatus === 1) return false // 编辑中，不显示
    if (ownerList.includes(shopId)) return true
    if (adminList.includes(shopId)) return true
    return false
  })

  const isShowDone = computed(() => {
    const {editStatus} = globalData.value
    if (isShow.value) return false
    if (editStatus === 1) return true
    return false
  })
  
  const handleDone = () => {
    globalData.value.editStatus = 0
  }

  return {
    actions,
    isShow,
    isShowDone,
    handleDone
  }
}