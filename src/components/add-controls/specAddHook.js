import { ref, computed } from 'vue'
import { getImageUrl, getMulSpecName, getSpecPrices, getSelectedItemByIdList, getMulSpecUrl } from '@/util'
import { showImagePreview, showToast } from 'vant';
import { shopCarInstance } from '@/store'

export const useSpecAddHook = (props) => {
  const isShow = ref(false)

  const selectedInfo = ref({})
  
  const specDetials = computed(() => {
    return JSON.parse(props.productInfo?.specDetials || '{}')
  })

  const displaySpecList = computed(() => {
    const {isSpec} = props.productInfo
    const singleSpecs = specDetials.value.singleSpecs || []
    const mulSpecs = specDetials.value.mulSpecs ||[]
    if (isSpec === 1) { // 单级规格
      const specItem = {name: '规格', list: []}
      for (const item of singleSpecs) {
        specItem.list.push(item)
      }
      return [specItem]
    }
    if (isSpec === 2) { // 多级规格
      return mulSpecs || []
    }

    return [] // 兜底
  })

  const subSpecClickHandle = async (idx, subIdx) => {
    if (props.productInfo.isSpec === 2) {
      const disabled = isDisabled(idx, subIdx)
      if (disabled) return
    }

    const val = selectedInfo.value[idx]
    if ([null, undefined].includes(val)) {
      selectedInfo.value[idx] = subIdx
    } else {
      if (val === subIdx) {
        selectedInfo.value[idx] = null
      } else {
        selectedInfo.value[idx] = subIdx
      }
    }
  }

  const isActive = (idx, subIdx) => {
    if (selectedInfo.value[idx] === subIdx) return true
    return false
  }

  const getSingleUrl = () => {
    const keys = Object.keys(selectedInfo.value)
    const {singleUseImg, singleSpecs} = specDetials.value
    if (singleUseImg === 0) return '';
    for (const idx of keys) {
      const val = selectedInfo.value[idx]
      if ([undefined, null].includes(val)) continue
      const matchedItem = singleSpecs[val]
      if (!matchedItem || !matchedItem?.url) continue
      return matchedItem.url
    }
    return ''
  }

  const getSelectedId = () => {
    const { mulSpecs } = specDetials.value
    const ret = []
    for (let i = 0; i < mulSpecs.length; i ++) {
      const val = selectedInfo.value[i]
      if ([undefined, null].includes(val)) {
        ret.push(null)
        continue
      }
      const id = mulSpecs[i].list[val].id
      ret.push(id)
    }
    return ret
  }

  const getMulUrl = () => {
    const {mulUseImg, mulSpecs, mulSpecPriceList} = specDetials.value
    if (mulUseImg === 0) return ''
    const selectedIds = getSelectedId()
    return  getMulSpecUrl(selectedIds, mulSpecs, mulSpecPriceList)
  }

  const displayUrl = computed(() => {
    const { url, isSpec } = props.productInfo
    const defaultUrl = url.split(',')[0]
    if (isSpec === 1) { // 单级规格
      const ret = getSingleUrl()
      if (ret) return getImageUrl(ret)
    }

    if (isSpec === 2) { // 多级规格
      const ret = getMulUrl()
      if (ret) return getImageUrl(ret)
    }

    return getImageUrl(defaultUrl)
  })

  const viewImg= (url) => {
    showImagePreview([url])
  }

  const getSingTxt = () => {
    const val = selectedInfo.value[0]
    if ([undefined, null].includes(val)) return '请选择规格'
    const name = specDetials.value?.singleSpecs?.[val]?.name
    return `已选：${name}`
  }

  const getMulTxt = () => {
    const selectedIds = getSelectedId()
    const data = getMulSpecName(selectedIds, specDetials.value.mulSpecs)
    let ret = ''
    for (const name of data) {
      if (!name) continue
      if (ret) ret += '｜'
      ret += name
    }
    if (ret) return `已选：${ret}`
    return '请选择规格'
  }

  const displaySelectedTxt = computed(() => {
    if (props.productInfo.isSpec === 1) return getSingTxt()
    if (props.productInfo.isSpec === 2) return getMulTxt()
    return ''
  })

  const getSingPrice = () => {
    const val = selectedInfo.value[0]
    const singleSpecs = specDetials.value.singleSpecs || []
    if ([undefined, null].includes(val)) {
      const {min, max} = getSpecPrices(singleSpecs)
      if (min === '') return ''
      if (min === max) return min
      return `${min} ～ ${max}`
    }
    return singleSpecs[val].price || ''
  }

  const getMulPrice = () => {
    const { mulSpecPriceList } = specDetials.value
    const selectedIds = getSelectedId()
    const isSelectedAll = !selectedIds.includes(null) // 是否选齐了规格
    if (!isSelectedAll) {
      const {min, max} = getSpecPrices(mulSpecPriceList)
      if (min === '') return ''
      if (min === max) return min
      return `${min} ～ ${max}`
    }
    const priceItem = getSelectedItemByIdList(selectedIds, mulSpecPriceList)
    return priceItem?.price || ''

  }
  
  const priceDisplay = computed(() => {
    if (props.productInfo.isSpec === 1) return getSingPrice()
    if (props.productInfo.isSpec === 2) return getMulPrice()
    return ''
  })

  const isDisabled = (idx, subIdx) => {
    // 这里有点复杂
    if (props.productInfo.isSpec !== 2) return false
    const { mulSpecPriceList, mulSpecs } = specDetials.value
    const selectedIds = getSelectedId()
    let selectedAbled = mulSpecPriceList.filter((item) => item.specStatus === 1 )
    if (selectedAbled.length === 0) return false
    const currId = mulSpecs[idx].list[subIdx].id
    const restList = [] // 过滤后可选的项
    for (const priceItem of selectedAbled) {
      let pass = true
      for(let i = 0; i < selectedIds.length; i ++) {
        if (idx === i) continue
        if (selectedIds[i] === null) continue
        if (selectedIds[i] === priceItem.list[i]) continue
        pass = false
      }
      if (pass) restList.push(priceItem)
    }
    for (const priceItem of restList) {
      if (priceItem.list.includes(currId)) return false
    }
    return true
  }

  const getSingleCount = () => { 
    const {singleSpecs} = specDetials.value
    const val = selectedInfo.value[0]
    if ([undefined, null].includes(val)) return 0
    const name = singleSpecs[val].name
    const data = shopCarInstance.getData(props.productInfo, name)
    return data.value.count.value ||0
  }

  const setSingCount = (count) => {
    const {singleSpecs} = specDetials.value
    const val = selectedInfo.value[0]
    if ([undefined, null].includes(val)) return
    const name = singleSpecs[val].name
    const data = shopCarInstance.getData(props.productInfo, name)
    data.value.count.value = count
  }

  const getMulCount = () => {
    const selectedIds = getSelectedId()
    if (selectedIds.includes(null)) return 0 // 还没选完
    const { mulSpecs } = specDetials.value
    const names = getMulSpecName(selectedIds,  mulSpecs)
    const specName = names.join('｜')
    const data = shopCarInstance.getData(props.productInfo, specName)
    return  data.value.count.value || 0
  }

  const setMulCount = (count) => {
    const selectedIds = getSelectedId()
    if (selectedIds.includes(null)) return // 还没选完
    const { mulSpecs } = specDetials.value
    const names = getMulSpecName(selectedIds,  mulSpecs)
    const specName = names.join('｜')
    const data = shopCarInstance.getData(props.productInfo, specName)
    data.value.count.value = count
  }
  
  const displaySpecCount = computed({
    get() {
      const { isSpec } = props.productInfo
      if (isSpec === 1) {
        return getSingleCount()
      }
      if (isSpec === 2)  {
        return getMulCount()
      }
      return 0
    },
    set(val) {
      const { isSpec } = props.productInfo
      if (isSpec === 1) setSingCount(val)
      if (isSpec === 2) setMulCount(val)
    }
  })

  
  const addHandle = () => {
    const {isSpec} = props.productInfo
    if (isSpec === 1) {
      if([undefined, null].includes(selectedInfo.value[0])) {
        showToast('请选择规格')
        return
      }
      displaySpecCount.value = 1
    }
    if (isSpec === 2) {
      const selectedIds = getSelectedId()
      for (let i = 0; i < selectedIds.length; i ++) {
        if (selectedIds[i] === null) {
          const {mulSpecs} = specDetials.value
          showToast(`请选择${mulSpecs[i].name}`)
          return
        }
      }
      displaySpecCount.value = 1
    }
  }
  
  const show = async () => {
    selectedInfo.value = {}
    isShow.value = true
  }

  return {
    isShow, show, displaySpecList, subSpecClickHandle, isActive, displayUrl, viewImg,
    displaySelectedTxt, priceDisplay, isDisabled, displaySpecCount, addHandle
  }
}