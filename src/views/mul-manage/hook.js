import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commonFetch, sleep, getImageUrl, shopInfoManage, mulSpecName2Ids, getSelectedItemByIdList } from '@/util'
import { getInventory, getProduct } from '@/http'
import {globalData} from '@/store'

export const useMulManage = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = +route.params.shopId
  const id = +route.params.id

  const leftList = ref([])
  const rightList = ref([])
  const leftListRef = ref()
  const rightListRef = ref()

  class ListManage {
    constructor() {
      this.taskList = []
      this.runing = false
      this.cacheList = []
      this.leftH = 0
      this.rightH = 0
    }

    async exe () {
      this.runing = true
      while(this.taskList.length) {
        const prodItem = this.taskList.shift()
        let {imgw, imgh} = prodItem
        if (!imgw || !imgh) {
          imgw = 1
          imgh = 1
        }
        let ratio = imgh / imgw
        ratio = ratio >= 2 ? 2: ratio
        ratio = ratio <= 0.75 ? 0.75 : ratio
        if (this.leftH <= this.rightH) {
          this.leftH += ratio
          leftList.value.push(prodItem)
        } else {
          this.rightH += ratio
          rightList.value.push(prodItem)
        }
      }
      this.runing = false
    }

    add(list) {
      for (const item of list) {
        this.taskList.push(item)
        this.cacheList.push(item)
      }
      if (!this.runing) this.exe()
    }

    clear() {
      this.taskList = []
      this.cacheList = []
      this.leftH = 0
      this.rightH = 0
    }

  }

  const listManage = new ListManage()

  const getData = async () => {
    let ret = await commonFetch(getInventory, { id, type: 1 })
    if (!ret.length) return
    ret = ret[0]
    const inventoryProds = JSON.parse(ret.data)
    let s = new Set()
    for (const item of inventoryProds.list) {
      s.add(item.id)
    }
    const productId = [...s]
    if (!productId.length) return
    let productData = await commonFetch(getProduct, {shopId, productId, pageSize: 500})
    const { list } = productData
    try {
      for (const inventoryItem of inventoryProds.list) {
        if (!inventoryItem.modPrice) continue
        const matchedItem = list.find((item) => item.id === inventoryItem.id)
        if (!matchedItem) continue
        if (matchedItem.isSpec === 0) { // 新的产品无规格
          if (inventoryItem.spec) continue // 旧的有规格，此时丢弃这条数据
          matchedItem.price = inventoryItem.price
        }
        if (matchedItem.isSpec === 1) { // 新产品是单级规格
          const specDetials = JSON.parse(matchedItem.specDetials || '{}')
          const singleSpecs = specDetials.singleSpecs || []
          const specItem = singleSpecs.find((item) => item.name === inventoryItem.spec)
          if (!specItem) continue
          specItem.price = inventoryItem.price
          matchedItem.specDetials = JSON.stringify(specDetials)
        }
        if (matchedItem.isSpec === 2) {
          const specDetials = JSON.parse(matchedItem.specDetials || '{}')
          const mulSpecs = specDetials.mulSpecs || []
          const mulSpecPriceList = specDetials.mulSpecPriceList || []
          const idList = mulSpecName2Ids(inventoryItem.spec, mulSpecs)
          if (!idList.length) continue
          const priceItem = getSelectedItemByIdList(idList, mulSpecPriceList)
          if (!priceItem) continue
          priceItem.price = inventoryItem.price
          console.log(inventoryItem.price)
          matchedItem.specDetials = JSON.stringify(specDetials)
        }
      }
    } catch(e) {
      console.error(e)
    }
    listManage.add(list)
  }

  const init = () => {
    getData()
    globalData.value.mulManageId = id
  }

  init()

  return {
    leftList,
    rightList,
    leftListRef,
    rightListRef
  }

}