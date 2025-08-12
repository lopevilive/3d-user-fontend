import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProduct } from '@/http'
import {
  commonFetch,toSharePage, shopInfoManage, getImageUrl, getTypeName, formatAttrs, getMulSpecName,
  getMulSpecUrl, getSpecPrices
} from '@/util'
import { globalData } from '@/store'


export const useProductDetial = () => {
  const route = useRoute()
  const router = useRouter()
  const productId = +route.params.id
  const shopId = +route.params.shopId

  const info = ref({})
  const done = ref(false)
  const shopInfo = ref()

  const imgList = computed(() => {
    const {url, isSpec} = info.value
    const {singleSpecs, singleUseImg, mulUseImg} = specDetials.value
    if (!url) return []
    const defau = url.split(',')
    if (isSpec === 0) return defau
    if (selectedSpecIdx.value === -1) return defau
    if (isSpec === 1) {
      if (singleUseImg === 0) return defau
      const specUrl = singleSpecs[selectedSpecIdx.value].url
      if (specUrl) return [specUrl]
    }
    if (isSpec === 2) {
      if (mulUseImg === 0) return defau
      const specUrl = specsDisplay.value[selectedSpecIdx.value]?.url
      if (specUrl) return [specUrl]
    }
    return defau
  })

  const specDetials = computed(() => {
    return JSON.parse(info.value.specDetials || '{}')
  })

  const displayAttrs = computed(() => {
    let attr = formatAttrs(info.value?.attr, shopInfo.value)
    if (info.value.productType) {
      const ret = getTypeName(info.value.productType)
      if (ret) attr.splice(0,0 , {name: '分类', val: ret})
    }
    return attr
  })

  const shareHandle = async () => {
    const {name} = shopInfo.value
    toSharePage({
      src_path: `/product-manage/${shopId}?toDetial=${info.value.id}&title=${encodeURIComponent(info.value.desc)}&imageUrl=${encodeURIComponent(getImageUrl(info.value.url.split(',')[0]))}`,
      url: info.value.url?.split(',')?.[0] || '',
      title: name,
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

  const selectedSpecIdx = ref(-1)

  const specItemClickHandle = (idx) => {
    if (selectedSpecIdx.value === idx) {
      selectedSpecIdx.value = -1
    } else {
      selectedSpecIdx.value = idx
    }
  }

  const specsDisplay = computed(() => {
    const {isSpec} = info.value
    if (isSpec === 0) return []
    if (isSpec === 1) {
      const {singleSpecs} = specDetials.value
      return singleSpecs
    }
    if (isSpec === 2) {
      const {mulSpecPriceList, mulSpecs} = specDetials.value
      const ret = []
      for (const item of mulSpecPriceList) {
        if (item.specStatus === 0) continue
        const names = getMulSpecName(item.list, mulSpecs)
        const name = names.join('｜')
        const url = getMulSpecUrl(item.list, mulSpecs, mulSpecPriceList)
        const data = {name, price: item.price, url}
        ret.push(data)
      }
      return ret
    }
    return []
  })

  const getSingPrice = () => {
    const {singleSpecs} = specDetials.value
    if (selectedSpecIdx.value === -1) {
      const {min, max} = getSpecPrices(singleSpecs)
      if (min === '') return ''
      if (min === max) return String(min)
      return `${min} ~ ${max}`
    }
    return String(singleSpecs[selectedSpecIdx.value]?.price || '')
  }

  const getMulPrice = () => {
    if (selectedSpecIdx.value === -1) {
      const {min, max} = getSpecPrices(specsDisplay.value)
      if (min === '') return ''
      if (min === max) return String(min)
      return `${min} ~ ${max}`
    }
    return String(specsDisplay.value?.[selectedSpecIdx.value]?.price || '')
  }
  
  const displayPrice = computed(() => {
    const { isSpec, price } = info.value
    if (isSpec === 0) return price
    if (isSpec === 1) return getSingPrice()
    if (isSpec === 2) return getMulPrice()
    return ''
  })

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
  
  const isShowShare = computed(() => {
    const {rid} = globalData.value
    if ([2,3,99].includes(rid)) return true
    if (shopInfo.value.forwardPermi === 1) return false
    return true
  })

  const isShowSpecImg = (item) => {
    if (!item.url) return false
    const {singleUseImg, mulUseImg} = specDetials.value
    if (info.value.isSpec === 1) {
      if (singleUseImg === 0) return false
    }
    if (info.value.isSpec === 2) {
      if (mulUseImg === 0) return false
    }
    return true
  }

  const viewSpecDetialHandle = () => {
    const ret = document.querySelector(`button[name=add-controls-spec]`)
    if (ret) ret.click()
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
    info, imgList, init, shareHandle, displayAttrs, isShowSticky, specsDisplay, selectedSpecIdx,
    displayPrice, isShowDownTips, goback, isShowEmpty, isShowShare, isShowSpecImg, specItemClickHandle,
    viewSpecDetialHandle
  }
}