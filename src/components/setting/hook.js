import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productDel } from '@/http'
import { commonFetch } from '@/util'

export const useSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId
  const productId = + route.params.id

  const actions = [
    {
      name: '图册管理',
      action: () => {
        router.push({name: 'album-mod', params: {id: shopId}})
      },
      includes: ['product-manage', 'product-detial']
    },
    {
      name: '商品管理',
      action: () => {
        globalData.value.editStatus = 1;
      },
      includes: ['product-manage']
    },
    {
      name: '新增商品',
      action: () => {
        router.push({name: 'product-edit'})
      },
      includes: ['product-manage']
    },
    {
      name: '分类管理',
      action: () => {
        router.push({name: 'type-manage'})
      },
      includes: ['product-manage', 'product-detial']
    },
    {
      name: '编辑商品',
      action: () => {
        router.push({name: 'product-edit', params: {id: productId}})
      },
      includes: ['product-detial']
    },
    {
      name: '删除商品',
      action: async () => {
        await commonFetch(productDel, {id: productId})
        router.replace({name: 'product-manage'})
      },
      includes: ['product-detial']
    }
  ]

  const actionDisplay = computed(() => {
    const ret = []
    for (const item of actions) {
      if (item.includes.includes(route.name)) {
        ret.push(item)
      }
    }
    return ret
  })

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
    handleDone,
    actionDisplay
  }
}