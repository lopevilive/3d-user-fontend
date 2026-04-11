import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productDel, productMod, moveTopProduct } from '@/http'
import { commonFetch, getFlexW, emitter} from '@/util'
import { showConfirmDialog } from 'vant';

export const useSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const actionsSheetRef = ref()
  const gap = getFlexW(24)

  const _change = ref(false)
  const localKey = 'settingFloatPos'
  const offsetDisPlay = computed({
    get() {
      if (_change.value) {}
      const num = 2;
      let x = getFlexW(375 - 24 - 30)
      let y = Math.floor(window.innerHeight / 2 + getFlexW(20 * num) + getFlexW(30) * num)
      let localData = localStorage.getItem(localKey)
      if (localData) {
        try {
          localData = JSON.parse(localData)
          x = localData.x
          y = localData.y
        } catch(e) {
          console.error(e)
        }
      }
      return {x, y}
    },
    set(val) {
      let {x, y} = val
      x = parseInt(x)
      y = parseInt(y)
      const localData = {x, y}
      localStorage.setItem(localKey, JSON.stringify(localData))
      _change.value = !_change.value
    }
  })

  const acProdMod = () => {
    const shopId = + route.params.shopId
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
    const productId = + route.params.id
    router.push({name: 'product-edit', params: {id: productId}})
  }

  const acProdDel = async () => {
    const productId = + route.params.id
    const shopId = + route.params.shopId
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

  const acProdMove = async () => { // 置顶产品
    const shopId = + route.params.shopId
    const productId = + route.params.id
    await commonFetch(moveTopProduct, {id: productId, shopId})
    emitter.emit('prodUpdate')
    globalData.value.productNeedExec.push({type: 'sort'})
  }

  const acProdReMove = async () => { //  取消置顶产品
    const shopId = + route.params.shopId
    const productId = + route.params.id
    await commonFetch(productMod, {id: productId, shopId, sort: 0})
    emitter.emit('prodUpdate')
    globalData.value.productNeedExec.push({type: 'sort'})
  }

  const updateAlbumRef = ref()
  const upDateAlbum = async () => {
    updateAlbumRef.value.show()
  }

  const modShopStatusRef = ref()
  const toModStatus = async () => {
    modShopStatusRef.value.show()
  }

  const acDownProduct = async () => {
    const shopId = + route.params.shopId
    const productId = + route.params.id
    await showConfirmDialog({
      title: '下架产品',
      message: '确定下架该产品?'
    })
    await commonFetch(productMod, {id: productId, shopId, status: 1})
    emitter.emit('prodUpdate')
    globalData.value.productNeedExec.push({type: 'status'})
  }

  const acOnProduct = async () => {
    const shopId = + route.params.shopId
    const productId = + route.params.id
    await showConfirmDialog({
      title: '上架产品',
      message: '确定上架该产品?'
    })
    await commonFetch(productMod, {id: productId, shopId, status:0})
    emitter.emit('prodUpdate')
    globalData.value.productNeedExec.push({type: 'status'})
  }
  
  
  const acToCusInventory = () => {
    globalData.value.cusInventoryNeedUpdate = true
    router.push({name: 'cus-inventory'})
  }
  
  const actions = [
    [
      {name: '新增产品', color: '#64b486', action: acAddProd, includes: ['product-manage', 'contact', 'custom-home']},
      {name: '产品管理', color: '#5794f7', action: acProdMod, includes: ['product-manage', 'contact', 'custom-home']},
      {name: '分类管理', color: '#5794f7', action: acTypesMod, includes: ['product-manage', 'contact', 'custom-home']},
    ],
    [
      {name: '置顶', color: '#5794f7', action: acProdMove, includes: ['product-detial'], rule: () => {
        const {currViewProd} = globalData.value
        if (!currViewProd) return false
        if (currViewProd?.sort === 0) return true
        return false
      }},
      {name: '取消置顶', color: '#f29b73', action: acProdReMove, includes:['product-detial'],  rule: () => {
        const {currViewProd} = globalData.value
        if (!currViewProd) return false
        if (currViewProd?.sort > 0) return true
        return false
      }},
      {name: '编辑产品', color: '#5794f7', action: acProdEdit, includes: ['product-detial']},
    ],
    [
      {name: '下架产品', color: '#f29b73', action: acDownProduct, includes: ['product-detial'], rule: () => {
        const {currViewProd} = globalData.value
        if (!currViewProd) return false
        if (currViewProd?.status === 0) return true
        return false
      }},
      {name: '上架产品', color: '#64b486', action: acOnProduct, includes: ['product-detial'], rule: () => {
        const {currViewProd} = globalData.value
        if (!currViewProd) return false
        if (currViewProd?.status === 1) return true
        return false
      }},
      {name: '删除产品', color: '#ee0a24', icon: 'delete-o', action: acProdDel, includes: ['product-detial']},
    ],
    [
      {name: '客户清单', color: '#5794f7', icon: 'orders-o', action: acToCusInventory , includes: ['product-manage', 'contact', 'custom-home']},
      {name: '图册设置', color: '#5794f7', action: acToSetSys , includes: ['product-manage', 'contact', 'custom-home']},
    ],
    [
      {name: '升级图册', color: '#5794f7', action: upDateAlbum, includes: ['product-manage'], rids: [99]},
      {name: 'modStatus', color: '#5794f7', action: toModStatus, includes: ['product-manage'], rids: [99]}
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
          if (item.rule) {
            const ret = item.rule()
            if (ret) tmpRet.push(item)
          } else {
            tmpRet.push(item)
          }
          continue
        }
      }
      if (tmpRet.length) ret.push(tmpRet)
    }
    return ret
  })

  const isShow = computed(() => {
    if (!['custom-home', 'product-manage', 'contact', 'product-detial'].includes(route.name)) return false
    const {rid, editStatus} = globalData.value
    if (editStatus === 1) return false
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
    bubbleClickHandle,
    actionHandle,
    gap,
    updateAlbumRef,
    modShopStatusRef,
    offsetDisPlay
  }
}