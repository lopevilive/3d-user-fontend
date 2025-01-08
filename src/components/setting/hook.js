import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productDel, productMod, moveTopProduct } from '@/http'
import { commonFetch, toSharePage,  shopInfoManage, getImageUrl} from '@/util'
import { showConfirmDialog } from 'vant';

export const useSetting = (props, emits) => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId
  const productId = + route.params.id
  const actionsSheetRef = ref()
  const gap = (window.innerWidth * 24) / 375
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
    let shopInfo = await shopInfoManage.getShopInfo(shopId)
    shopInfo = shopInfo[0]
    toSharePage({
      src_path: `/product-manage/${shopId}?title=${encodeURIComponent(shopInfo.name)}&imageUrl=${encodeURIComponent(getImageUrl(shopInfo.url.split(',')[0]))}`,
      url: shopInfo.url?.split(',')?.[0] || '',
      title: shopInfo.name,
      desc1: [shopInfo.desc || ''],
      desc2: [],
      scene: {name: 'product-manage', shopId}
    })
  }
  
  const actions = [
    [
      {name: '新增产品', color: '#64b486', action: acAddProd, includes: ['product-manage', 'contact']},
    ],
    [
      {name: '产品管理', color: '#5794f7', action: acProdMod, includes: ['product-manage', 'contact']},
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
      {name: '删除产品', color: '#ee0a24', action: acProdDel, includes: ['product-detial']},
      {name: '分类管理', color: '#5794f7', action: acTypesMod, includes: ['product-manage', 'contact']},
    ],
    [
      {name: '分享画册', color: '#64b486', action: acShare, includes: ['product-manage', 'contact']},
      {name: '画册设置', color: '#5794f7', action: acToSetSys , includes: ['product-manage', 'product-detial', 'contact']},
      {name: '画册列表', color: '#5794f7', action: acToAlbumList, includes: ['all'], rids: [99]}
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
    gap
  }
}