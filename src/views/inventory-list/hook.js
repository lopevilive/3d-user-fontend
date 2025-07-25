import { computed, ref } from 'vue'
import { shopCarInstance, globalData } from '@/store'
import { showConfirmDialog, showFailToast, showToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import {add, multiply, bignumber} from 'mathjs'
import { createInventory, getProduct } from '@/http'
import { commonFetch, toSharePage, shopInfoManage, emojiReg, formatType } from '@/util'

export const useInventoryList = () => {
  const route = useRoute()
  const router = useRouter()
  const shopId = +route.params.shopId

  const shopCarList = shopCarInstance.getAllData()
  const shopInfo = ref({})

  const handleUpdateCount = (item, val) => {
    val = Number(val)
    if (val > 0) {
      shopCarInstance.updateCount(item.id, item.spec, val)
    }
  }

  const deleteItem = (item) => {
    shopCarInstance.deleteItem(item)
    init()
  }

  const clearAllHandle = async () => {
    await showConfirmDialog({
      message:'确定清空清单？',
      confirmButtonText:'确定',
      cancelButtonText: '取消',
    })
    shopCarInstance.clearAll()
    router.go(-1)
  }

  const remark = computed({
    get() {
      return globalData.value.invertoryRemark || ''
    },
    set(val) {
      globalData.value.invertoryRemark = val
    }
  })

  const selectedList = ref([])

  const getIsCheck = (item) => {
    const {id, spec} = item
    let key = `${id}-${spec}`
    if (selectedList.value.includes(key)) return true
    return false
  }

  const checkClickHandle = (item) => {
    const {id, spec} = item
    let key = `${id}-${spec}`
    const idx = selectedList.value.findIndex((item) => item === key)
    if (idx === -1) {
      selectedList.value.push(key)
    } else {
      selectedList.value.splice(idx, 1)
    }
  }

  const isCheckedAll = computed(() => {
    return selectedList.value.length === shopCarList.value.length
  })

  const checkedAllHandle = () => {
    if (isCheckedAll.value) {
      selectedList.value = []
    } else {
      init()
    }
  }

  const getAllSelectedData = () => {
    let ret = []
    for (const item of shopCarList.value) {
      const {id, spec} = item
      const key = `${id}-${spec}`
      if (!selectedList.value.includes(key)) continue
      ret.push(item)
    }
    return ret
  }

  const totalCount = computed(() => {
    let ret = 0
    const list = getAllSelectedData()
    for (const item of list) {
      ret += item.count
    }
    return ret
  })

  const totalPrice = computed(() => {
    let ret = 0
    try {
      const list = getAllSelectedData()
      for (const item of list) {
        let tmp = multiply(bignumber(item.price), bignumber(item.count))
        ret = add(ret, tmp)
      }
      return ret.toString()
    } catch(e) {
      return '--'
    }
  })

  const disabled = computed(() => {
    if (totalCount.value === 0) return true
    return false
  })

  const toCreate = async (type = 0) => {
    const {selectedAddress, addressList} = globalData.value
    let address = ''
    for (const item of addressList) {
      if (selectedAddress.includes(item.id)) {
        address = `${item.name || ''} ${item.province || ''}${item.city || ''}${item.county || ''}${item.addressDetail || ''} ${item.tel || ''}`
      }
    }
    const list = shopCarList.value.map((item) => {
      return {
        ...item,
        desc: item.desc.replaceAll(emojiReg, '')
      }
    })

    const payload = {
      shopId, type,
      data: {
        list: list,
        remark: globalData.value.invertoryRemark || '',
        address,
        totalCount: totalCount.value,
        totalPrice: totalPrice.value,
      },
    }
    payload.data = JSON.stringify(payload.data)
    const data = await commonFetch(createInventory, payload)
    if (type === 0) globalData.value.hasInventory[shopId] = true
    return data
  }

  const toRequiredView = () => {
    const {requiredType} = shopInfo.value
    router.replace({name: 'product-manage', params: {shopId}, query: {activeType: requiredType} })
  }
  
  const toBuildInventory = async () => {
    if (!canBuild.value) {
      toRequiredView()
      return
    }
    const {addressStatus} = shopInfo.value
    if (addressStatus === 1) {
      if (globalData.value.selectedAddress.length === 0) {
        showFailToast('请填写收货信息~')
        return
      }
    }
    const data = await toCreate(0)
    shopCarInstance.clearAll()
    router.replace({name: 'view-inventory', params: {id: data}, query: {title: '购物清单', toShare: '1'}})
  }

  const mulShare = async () => {
    const data = await toCreate(1)
    const {url, name, desc} = shopInfo.value
    let src_path = `/product-manage/${shopId}/mul-manage/${data}?title=${encodeURIComponent(name)}`
    toSharePage({
      src_path,
      url: url?.split(',')?.[0] || '',
      title: name,
      desc1: [desc || ''],
      desc2: [],
      scene: {name: 'mul-manage', shopId, id: data}
    })
  }

  const isShowEditPrice = computed(() => {
    if ([2,3,99].includes(globalData.value.rid)) return true
    return false
  })

  const priceDialogRef = ref()
  const editPriceHandle = async (itemData) => {
    const priceInfo = await priceDialogRef.value.getPrice()
    const {id, spec} = itemData
    shopCarInstance.updatePrice(id, spec, priceInfo.price)
  }

  const goBack = () => {
    router.go(-1)
  }

  const canBuild = computed(() => {
    const {requiredType} = shopInfo.value
    if (!requiredType) return true
    const {type1, type2} = formatType(requiredType)
    for (const item of shopCarList.value) {
      const {type1: tmp1, type2: tmp2} = formatType(item.productType)
      if (type2) {
        if (type1 === tmp1 && type2 === tmp2) return true
      } else {
        if (type1 === tmp1) return true
      }
    }
    return false
  })

  const isShowMul = computed(() => {
    const {rid} = globalData.value
    if ([2,3,99].includes(rid)) return true
    if (shopInfo.value.forwardPermi === 1) return false
    return true
  })

  const validProd = async () => { // 这里校验产品
    const rawData = shopCarInstance.getLocalData()
    const ids = Object.keys(rawData).map((item) => Number(item))
    if (!ids.length) return
    const ret = await commonFetch(getProduct, {shopId, productId: ids, pageSize: 1000, status: 0})
    let change = false
    for (const id of ids) {
      const rawItem = rawData[id]
      const newInfo = ret.list.find((retItem) => retItem.id === id)
      if (!newInfo) { // 产品被删除/下架
        shopCarInstance.deleteProd(id)
        continue
      }
      if (newInfo.upd_time) {
        if (rawItem.productInfo.upd_time !== newInfo.upd_time) { // 产品信息发生变化
          change = true
          shopCarInstance.updateProdInfo(id, newInfo)
        }
      }
    }
    if (change) showToast('部分产品信息发生变化，请重新添加～')
  }

  const init = async () => {
    await validProd() // 校验产品合法性
    selectedList.value = []
    for (const item of shopCarList.value) {
      const {id, spec} = item
      let key = `${id}-${spec}`
      selectedList.value.push(key)
    }
    const tmp = await shopInfoManage.getData(shopId)
    shopInfo.value = tmp[0]
  }


  return {
    shopCarList,
    handleUpdateCount,
    deleteItem,
    clearAllHandle,
    remark,
    getIsCheck,
    checkClickHandle,
    init,
    isCheckedAll,
    checkedAllHandle,
    totalCount,
    totalPrice,
    toBuildInventory,
    disabled,
    mulShare,
    priceDialogRef,
    isShowEditPrice,
    editPriceHandle,
    goBack,
    canBuild,
    isShowMul
  }
}