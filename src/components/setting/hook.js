import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productDel, productMod, moveTopProduct } from '@/http'
import { commonFetch, toSharePage,  shopInfoManage, getImageUrl, getFlexW} from '@/util'
import { showConfirmDialog } from 'vant';

export const useSetting = (props, emits) => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId
  const productId = + route.params.id
  const actionsSheetRef = ref()
  const gap = getFlexW(24)
  const offset = ref({ x: getFlexW(375 - 24 - 30), y: window.innerHeight * 0.8});

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

  const acToAlbumList = () => {
    router.push({name: 'album-list'})
  }

  const acProdMove = async () => {
    const {runtimeData} = props
    if (!runtimeData) return
    const {id, shopId} = props.runtimeData
    await commonFetch(moveTopProduct, {id, shopId})
    emits('update')
    globalData.value.productNeedExec.push({type: 'sort'})
  }

  const acProdReMove = async () => {
    const {runtimeData} = props
    if (!runtimeData) return
    const {id, shopId} = runtimeData
    await commonFetch(productMod, {id, shopId, sort: 0})
    emits('update')
    globalData.value.productNeedExec.push({type: 'sort'})
  }

  const acShare = async () => {
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    const {name, url, desc, forwardPermi} = shopInfo
    toSharePage({
      src_path: `/product-manage/${shopId}?title=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(getImageUrl(url.split(',')[0]))}`,
      url: url?.split(',')?.[0] || '',
      title: name,
      desc1: [desc || ''],
      desc2: [],
      scene: {name: 'product-manage', shopId},
      forwardPermi
    })
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
    const {runtimeData} = props
    await showConfirmDialog({
      title: '下架产品',
      message: '确定下架该产品?'
    })
    await commonFetch(productMod, {id: runtimeData.id, shopId, status: 1})
    emits('update')
    globalData.value.productNeedExec.push({type: 'status'})
  }

  const acOnProduct = async () => {
    const {runtimeData} = props
    await showConfirmDialog({
      title: '上架产品',
      message: '确定上架该产品?'
    })
    await commonFetch(productMod, {id: runtimeData.id, shopId, status:0})
    emits('update')
    globalData.value.productNeedExec.push({type: 'status'})
  }
  
  
  const acToCusInventory = () => {
    globalData.value.cusInventoryNeedUpdate = true
    router.push({name: 'cus-inventory'})
  }
  
  const actions = [
    [
      {name: '新增产品', color: '#64b486', action: acAddProd, includes: ['product-manage', 'contact']},
      {name: '产品管理', color: '#5794f7', action: acProdMod, includes: ['product-manage', 'contact']},
      {name: '分类管理', color: '#5794f7', action: acTypesMod, includes: ['product-manage', 'contact']},
    ],
    [
      {name: '置顶', color: '#5794f7', action: acProdMove, includes: ['product-detial'], rule: (runtimeData) => {
        if (!runtimeData) return false
        if (runtimeData?.sort === 0) return true
        return false
      }},
      {name: '取消置顶', color: '#f29b73', action: acProdReMove, includes:['product-detial'],  rule: (runtimeData) => {
        if (!runtimeData) return false
        if (runtimeData?.sort > 0) return true
        return false
      }},
      {name: '编辑产品', color: '#5794f7', action: acProdEdit, includes: ['product-detial']},
    ],
    [
      {name: '下架产品', color: '#f29b73', action: acDownProduct, includes: ['product-detial'], rule: (runtimeData) => {
        if (!runtimeData) return false
        if (runtimeData?.status === 0) return true
        return false
      }},
      {name: '上架产品', color: '#64b486', action: acOnProduct, includes: ['product-detial'], rule: (runtimeData) => {
        if (!runtimeData) return false
        if (runtimeData?.status === 1) return true
        return false
      }},
      {name: '删除产品', color: '#ee0a24', icon: 'delete-o', action: acProdDel, includes: ['product-detial']},
    ],
    [
      {name: '分享图册', color: '#64b486', icon: 'share-o', action: acShare, includes: ['product-manage', 'contact']},
      {name: '客户清单', color: '#5794f7', icon: 'orders-o', action: acToCusInventory , includes: ['product-manage', 'contact']},
      {name: '图册设置', color: '#5794f7', action: acToSetSys , includes: ['product-manage', 'contact']},
    ],
    [
      {name: '图册列表', color: '#5794f7', action: acToAlbumList, includes: ['all'], rids: [99]},
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
        if (item.includes.includes('all') || item.includes.includes(route.name)) {
          if (item.rule) {
            const ret = item.rule(props.runtimeData)
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
    actionHandle,
    gap,
    updateAlbumRef,
    modShopStatusRef
  }
}