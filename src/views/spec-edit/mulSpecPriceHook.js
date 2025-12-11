import { computed, ref } from 'vue'
import {
  specManageInstance, priceReg, getMulSpecName, getSpecPrices, getMulSpecUrl, shopInfoManage,
  isVip, toVip
} from '@/util'
import { globalData } from '@/store'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'


export const useMulSpecPrice = () => {
  const router = useRouter()
  const route = useRoute()

  const shopId = +route.params.shopId
  const shopInfo = ref()

  const mulUseImg = ref(0)
  const mulSpecs = ref([])
  const specInfoList = ref([])
  const uploadImgsRef = ref([])
  let rawMulSpecPriceList = []
  const filterIds = ref([])

  const beforeDestory = async () => {
    setTimeout(() => {
      globalData.value.specEditNeedAlive = false
    }, 300);
  }

  const getData = () => {
    const rawData = specManageInstance.getRawData()
    const specDetials = JSON.parse(rawData.specDetials || '{}')
    specDetials.mulUseImg = mulUseImg.value
    specDetials.mulSpecPriceList = specInfoList.value
    return specDetials
  }
  
  const saveHandle = async () => {
    for (const item of uploadImgsRef.value) {
      if (!item) continue
      if (item?.isLoading) {
        showToast('请等待图片上传完成再保存～')
        return
      }
    }
    const specDetials = getData()
    specDetials.singleSpecs = []
    specDetials.singleUseImg = 0

    const {min} = getSpecPrices(specDetials.mulSpecPriceList)
    
    const payload = {
      price: min,
      specDetials: JSON.stringify(specDetials)
    }
    await specManageInstance.saveHandle(payload, shopId)
    router.go(-2)
  }

  const modMulUseImg = async (val) => {
    if (!isVip(shopInfo.value)) {
      await showConfirmDialog({
        message: '开通会员后可使用图片功能。\n(注：会员99/年)',
        confirmButtonText: '前往开通',
        cancelButtonText: '好的'
      })
      toVip(shopId)
      return 
    }
    mulUseImg.value = val ? 1: 0
  }
  
  const mulUseImgDisplay = computed({
    get() {
      return mulUseImg.value === 1
    },
    set(val) {
      modMulUseImg(val)
    }
  })

  const displayItemTit = computed(() => {
    let str = ''
    for (const item of mulSpecs.value) {
      if (str) str +=  '、'
      str += item.name
    }
    return str
  })

  const formatList = () => {
    if (!mulSpecs.value.length) return
    let idList = mulSpecs.value[0].list.map((item) => [item.id])
    let idx = 0
    for (const item of mulSpecs.value) {
      idx += 1
      if (idx === 1) continue
      const newRet = []
      while(idList.length) {
        const retItem = idList.splice(0,1)[0]
        for (const subItem of item.list) {
          const newItem = [...retItem, subItem.id]
          newRet.push(newItem)
        }
      }
      idList = newRet
    }
    for (const item of idList) {
      const data = {list: item, price: '', specStatus: 1, url: ''}
      for (const rawItem of rawMulSpecPriceList) {
        let matched = true
        for (const id of item) {
          const tmpIdx = rawItem.list.findIndex((a) => a === id)
          if (tmpIdx === -1) {
            matched = false
            break
          }
        }
        if (matched) {
          data.price = rawItem.price
          data.specStatus = rawItem.specStatus
          if (rawItem.url) data.url = rawItem.url
        }
      }
      specInfoList.value.push(data)
    }
  }

  const getDisplayName = (list) => {
    const data = getMulSpecName(list, mulSpecs.value)
    let ret = ''
    for (const name of data) {
      if (!name) continue
      if (ret) ret += '｜'
      ret += name
    }
    
    return ret
  }

  const specStatusHandle = (item) => {
    if (item.specStatus === 1) {
      item.specStatus = 0
    } else if (item.specStatus === 0) {
      item.specStatus = 1
    }
  }

  const inputDialogRef = ref()
  const mulPirceMod = async () => { // 批量设置价格
    const ret = await inputDialogRef.value.getVal('', {title: '批量设置价格', nullAble: true, validFn: (str) => {
      if (str) {
        if (!priceReg.test(str)) return '请输入正确价格'
      }
    }})
    for (const item of specInfoList.value) {
      if (!dispyalSpecInfoList.value.includes(item)) continue
      item.price = ret
    }
  }

  const updateImgHandle = (url, priceItem) => {
    if (url) {
      priceItem.url = url
    } else {
      priceItem.url = 'none'
    }
  }

  const getDisplayUrl = (item) => {
    return getMulSpecUrl(item.list, mulSpecs.value, specInfoList.value)
  }
  
  const filterSpecsRef = ref()
  const filterHandle = async () => {
    const ret = await filterSpecsRef.value.getData(JSON.parse(JSON.stringify(filterIds.value)))
    filterIds.value = ret
  }

  const dispyalSpecInfoList = computed(() => {
    let ret = []
    for (const item of specInfoList.value) {
      let pass = true
      for (let i = 0; i < item.list.length; i ++){
        const id = item.list[i]
        const idList = filterIds.value[i] || []
        if (idList.length === 0) continue
        if (idList.includes(id)) continue
        pass = false
        break
      }
      if (pass) ret.push(item)
    }
    return ret
  })

  const isShowItem = (itemData) => {
    return dispyalSpecInfoList.value.includes(itemData)
  }

  const init = async () => {
    const info = await shopInfoManage.getData(shopId)
    shopInfo.value = info[0]
    const ret = specManageInstance.getRawData()
    const specDetials = JSON.parse(ret.specDetials || '{}')
    mulUseImg.value = specDetials.mulUseImg || 0
    mulSpecs.value = specDetials.mulSpecs || []
    rawMulSpecPriceList = specDetials.mulSpecPriceList || []

    formatList()
  }

  return {
    beforeDestory, saveHandle, init, mulUseImgDisplay, displayItemTit, specInfoList, getDisplayName,
    specStatusHandle, uploadImgsRef, inputDialogRef, mulPirceMod, updateImgHandle, getDisplayUrl, filterSpecsRef,
    filterHandle, mulSpecs, isShowItem, dispyalSpecInfoList
  }
}