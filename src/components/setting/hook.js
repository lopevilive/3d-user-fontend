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
  const offset = ref({ x: (window.innerWidth * (375 - 24 - 30)) / 375, y: window.innerHeight * 0.8});

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
    await showConfirmDialog({
      message: `确定要删除这个产品吗?`
    })
    await commonFetch(productDel, {id: productId, shopId})
    globalData.value.productNeedExec.push({type: 'del', data: {id: productId}})
    router.replace({name: 'product-manage'})
  }

  const acToSetSys = async () => {
    router.push({name: 'sys-setting'})
  }
  
  const actions = [
    [
      {name: '新增产品', color: '#64b486', action: acAddProd, includes: ['product-manage', 'contact']},
    ],
    [
      {name: '产品管理', color: '#5794f7', action: acProdMod, includes: ['product-manage', 'contact']},
      {name: '编辑产品', color: '#5794f7', action: acProdEdit, includes: ['product-detial']},
      {name: '删除产品', color: '#ee0a24', action: acProdDel, includes: ['product-detial']},
      {name: '分类管理', color: '#5794f7', action: acTypesMod, includes: ['product-manage', 'product-detial', 'contact']},
    ],
    [
      // {name: '编辑图册', color: '#5794f7', action: acToAlbum, includes: ['product-manage', 'product-detial', 'contact']},
      // {name: '人员管理', color: '#5794f7', action: acStaff, includes: ['product-manage', 'product-detial', 'contact'], rids: [3,99]}
    ],
    [
      {name: '图册设置', color: '#5794f7', action: acToSetSys , includes: ['product-manage', 'product-detial', 'contact']}
    ]
  ]

  const actionDisplay = computed(() => {
    const {rid} = globalData.value
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
    const {rid} = globalData.value
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