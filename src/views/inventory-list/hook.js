import { computed, ref } from 'vue'
import { shopCarInstance, globalData } from '@/store'
import { showConfirmDialog } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import {add, multiply, bignumber} from 'mathjs'
import { createInventory } from '@/http'
import { commonFetch } from '@/util'

export const useInventoryList = () => {
  const route = useRoute()
  const router = useRouter()
  const shopId = +route.params.shopId

  const shopCarList = shopCarInstance.getAllData()

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

  const toBuildInventory = async () => {
    const {selectedAddress, addressList} = globalData.value
    let address = ''
    for (const item of addressList) {
      if (selectedAddress.includes(item.id)) {
        address = `${item.province}${item.city}${item.county}${item.addressDetail} ${item.name} ${item.tel}`
      }
    }

    const payload = {
      shopId,
      data: {
        list: shopCarList.value,
        remark: globalData.value.invertoryRemark || '',
        address,
        totalCount: totalCount.value,
        totalPrice: totalPrice.value
      }
    }
    payload.data = JSON.stringify(payload.data)
    const data = await commonFetch(createInventory, payload)
    shopCarInstance.clearAll()
    router.replace({name: 'view-inventory', params: {id: data}, query: {title: '报价清单'}})
  }

  const init = () => {
    selectedList.value = []
    for (const item of shopCarList.value) {
      const {id, spec} = item
      let key = `${id}-${spec}`
      selectedList.value.push(key)
    }
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
    disabled
  }
}