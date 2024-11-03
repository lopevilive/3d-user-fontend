import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productDel } from '@/http'
import { commonFetch } from '@/util'
import { showConfirmDialog } from 'vant';

export const useSetting = (props) => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId
  const productId = + route.params.id
  const actionsSheetRef = ref()
  const offset = ref({ x: document.body.clientWidth * 0.872, y: document.body.clientHeight * 0.7});

  const acToAlbum = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const acProdMod = () => {
    globalData.value.editStatus = 1;
  }

  const acAddProd = () => {
    router.push({name: 'product-edit'})
  }

  const acTypesMod = () => {
    router.push({name: 'type-manage'})
  }

  const acProdEdit = () => {
    router.push({name: 'product-edit', params: {id: productId}})
  }

  const acProdDel = async () => {
    const {runtimeData} = props
    await showConfirmDialog({
      title: '删除产品',
      message: `确定删除【${runtimeData.name}】?`
    })
    await commonFetch(productDel, {id: productId})
    globalData.value.productManageNeedUpdate = true
    router.replace({name: 'product-manage'})
  }
  
  const actions = [
    [
      {name: '产品管理', icon: 'apps-o', color: '#52b4f8', action: acProdMod, includes: ['product-manage']},
      {name: '新增产品', icon: 'add-o', color: '#64b486', action: acAddProd, includes: ['product-manage']},
      {name: '编辑产品', icon: 'edit', color: '#52b4f8', action: acProdEdit, includes: ['product-detial']},
      {name: '删除产品', icon: 'delete-o', color: '#ee0a24', action: acProdDel, includes: ['product-detial']},
    ],
    [
      {name: '图册管理', icon: 'column', action: acToAlbum, includes: ['product-manage', 'product-detial', 'contact']},
      {name: '分类管理', icon:'bars', action: acTypesMod, includes: ['product-manage', 'product-detial']}
    ],
  ]

  const actionDisplay = computed(() => {
    const ret = []
    for (const list of actions) {
      const tmpRet = []
      for (const item of list) {
        if (item.includes.includes(route.name)) {
          tmpRet.push(item)
        }
      }
      if (tmpRet.length) ret.push(tmpRet)
    }
    return ret
  })

  const isShow = computed(() => {
    const {userInfo: {ownerList, adminList}, editStatus} = globalData.value
    if (editStatus === 1) return false // 编辑中，不显示
    if (ownerList?.includes(shopId)) return true
    if (adminList?.includes(shopId)) return true
    return false
  })

  const bubbleClickHandle = () => {
    actionsSheetRef.value.show()
  }

  const actionHandle = (ac) => {
    const {action} = ac
    if (action) action()
  }

  return {
    isShow,
    actionDisplay,
    actionsSheetRef,
    offset,
    bubbleClickHandle,
    actionHandle
  }
}