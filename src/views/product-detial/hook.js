import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct } from '@/http'
import { commonFetch,toSharePage, shopInfoManage, getImageUrl, getTypeName, formatAttrs } from '@/util'
import { globalData } from '@/store'


export const useProductDetial = () => {
  const route = useRoute()
  const router = useRouter()
  const productId = +route.params.id
  const shopId = +route.params.shopId

  const info = ref({})
  const modelDisplayRef = ref()
  const done = ref(false)
  const shopInfo = ref()

  const imgList = computed(() => {
    const {url} = info.value
    if (!url) return []
    return url.split(',')
  })

  const displayAttrs = computed(() => {
    let attr = formatAttrs(info.value?.attr, shopInfo.value)
    if (info.value.productType) {
      const ret = getTypeName(info.value.productType)
      if (ret) attr.splice(0,0 , {name: '分类', val: ret})
    }
    return attr
  })

  const handleView3D = () => {
    modelDisplayRef.value.showModelDisplay()
  }

  const shareHandle = async () => {
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    toSharePage({
      src_path: `/product-manage/${shopId}?toDetial=${info.value.id}&title=${encodeURIComponent(info.value.desc)}&imageUrl=${encodeURIComponent(getImageUrl(info.value.url.split(',')[0]))}`,
      url: info.value.url?.split(',')?.[0] || '',
      title: shopInfo.name,
      desc1: [info.value.desc],
      desc2: [],
      scene: { name: 'product-detial', shopId, id: info.value.id }
    })
    
  }

  const isShowSticky = computed(() => {
    const {rid} = globalData.value
    if (![2,3,99].includes(rid)) return false
    if (info.value?.sort > 0) return true
    return false
  })

  const selectedSpecIdx = ref(0)

  const specsDisplay = computed(() => {
    const {isSpec, specs} = info.value
    if (isSpec !== 1) return []
    return JSON.parse(specs)
  })

  const displayPrice = computed(() => {
    const { isSpec, price } = info.value
    if (isSpec !== 1) return price
    return specsDisplay.value[selectedSpecIdx.value]?.price || ''
  })

  const isShowAction = ref(false)

  const selectHandle = (_, index) => {
    isShowAction.value = false
    selectedSpecIdx.value = index
  }

  const isShowDownTips = computed(() => {
    const { status } = info.value
    if (status === 1) return true
    return false
  })

  const isShowEmpty = computed(() => {
    if (info.value.id) return false
    if (done.value === true) return true
    return false
  })

  const goback = () => {
    router.go(-1)
  }
  
  const init = async () => {
    if (!productId) return
    const data = await commonFetch(getProduct, {productId})
    const ret = await shopInfoManage.getData(shopId)
    shopInfo.value = ret[0]
    done.value = true
    if (data.list.length) {
      info.value = data.list[0]
    }
  }

  return {
    info,
    imgList,
    handleView3D,
    init,
    modelDisplayRef,
    shareHandle,
    displayAttrs,
    isShowSticky,
    specsDisplay,
    selectedSpecIdx,
    displayPrice,
    isShowAction,
    selectHandle,
    isShowDownTips,
    goback,
    isShowEmpty
  }
}