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
  const offset = ref({ x: (window.innerWidth * (375 - 24 - 30)) / 375, y: window.innerHeight * 0.7});

  const {rid} = globalData.value

  const acToAlbum = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const acProdMod = () => {
    if (route.name !== 'product-manage') {
      router.push({name: 'product-manage', params: {shopId}, query: route.query})
    }
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

  const acStaff = async () => {
    router.push({name: 'staff-manage'})
  }
  
  const actions = [
    [
      {name: '产品管理', color: '#5794f7', action: acProdMod, includes: ['product-manage', 'contact']},
      {name: '新增产品', color: '#64b486', action: acAddProd, includes: ['product-manage', 'contact']},
      {name: '编辑产品', color: '#5794f7', action: acProdEdit, includes: ['product-detial']},
      {name: '删除产品', color: '#ee0a24', action: acProdDel, includes: ['product-detial']},
      {name: '分类管理', color: '#5794f7', action: acTypesMod, includes: ['product-manage', 'product-detial', 'contact']},
    ],
    [
      {name: '图册管理', color: '#5794f7', action: acToAlbum, includes: ['product-manage', 'product-detial', 'contact']},
      {name: '人员管理', color: '#5794f7', action: acStaff, includes: ['product-manage', 'product-detial', 'contact'], rids: [3,99]}
    ],
  ]

  const actionDisplay = computed(() => {
    const ret = []
    for (const list of actions) {
      const tmpRet = []
      for (const item of list) {
        if (item?.rids?.length) {
          if (!item.rids.includes(rid)) continue
        }
        if (item.includes.includes(route.name)) {
          tmpRet.push(item)
        }
      }
      if (tmpRet.length) ret.push(tmpRet)
    }
    return ret
  })

  const isShow = computed(() => {
    if (globalData.value.editStatus === 1) return false
    if ([2,3,99].includes(rid)) return true
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