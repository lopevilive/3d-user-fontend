import { computed, ref } from 'vue'
import router from '@/router/index.js'
import { getImageUrl, getSelectedItemByIdList, getMulSpecUrl, mulSpecName2Ids } from '@/util'

/**
 *  localData = {
 *    10: {
 *      productInfo: {},
 *      countMap: {
 *        __default: {
 *          count: 10,
 *        },
 *        specName1: {
 *          count: 2
 *        }
 *      }
 *    }
 *  }
 * 
 */
class ShopCarManage {
  constructor() {
    this.toggleMap = ref({})
    this.toggleAll = ref(true)
    this.allData = null
  }

  getLocalData() { // 获取原生清单信息
    const route = router.currentRoute.value
    const {shopId} = route.params
    let localData = localStorage.getItem(`shopCar-${shopId}`) || '{}'
    localData = JSON.parse(localData)
    return localData
  }

  setLocalData(data) { // 设置原生清单信息
    const route = router.currentRoute.value
    const {shopId} = route.params
    localStorage.setItem(`shopCar-${shopId}`, JSON.stringify(data))
  }

  getData(productInfo, specName = '__default') { // 获取某个产品的清单数量，返回 computed 属性
    const that = this
    const ret = computed({
      get() {
        const {id, upd_time} = productInfo
        return {
          productInfo,
          count: computed({
            get(){
              if (that.toggleMap.value[id]) {}
              let data = that.getLocalData()
              data = data[id] || {}
              return data?.countMap?.[specName]?.count || 0
            },
            set(val) {
              try {
                that.toggleMap.value[id] = !that.toggleMap.value?.[id] // 这里是为了触发依赖更新
                that.toggleAll.value = !that.toggleAll.value // 这里是为了触发依赖更新
                let data = that.getLocalData()
                let dataItem = data[id]
                if (!dataItem) {
                  dataItem = { productInfo, countMap: {} }
                  data[id] = dataItem
                }
                if (!dataItem.countMap?.[specName]) {
                  dataItem.countMap[specName] = {count: 0}
                }
                dataItem.countMap[specName].count = val
                that.setLocalData(data)
              } catch(e) {
                console.error(e)
                that.clearAll()
              }
              
            }
          })
        }
      }
    })
    return ret
  }

  getAllData () { // 返回computed 属性。全部产品信息
    if (this.allData) return this.allData
    this.allData = computed(() => {
      if (this.toggleAll.value) {}
      let localData = this.getLocalData()
      let ret = []
      localData = Object.values(localData)
      for (const item of localData) {
        const {countMap, productInfo: {desc, url, id, isSpec, specDetials, price, upd_time, modPrice, productType}} = item
        const keys = Object.keys(countMap)
        for (const specName of keys) {
          let count = countMap?.[specName]?.count || 0
          if (count <= 0) continue
          const retItem = { id, count, upd_time, price,url: getImageUrl(url.split(',')[0]), spec: '', desc, productType}
          if (modPrice) retItem.modPrice = modPrice
          if (isSpec === 1) { // 单级规格
            const matchedItem = JSON.parse(specDetials || '{}')
            const singleSpecs = matchedItem.singleSpecs || []
            const singleUseImg = matchedItem.singleUseImg || 0
            const singleItem = singleSpecs?.find((item) => item.name === specName)
            if (singleItem) {
              retItem.price = singleItem.price
              retItem.spec = specName
              if (singleUseImg && singleItem.url) {
                retItem.url = getImageUrl(singleItem.url)
              }
            }
          }
          if (isSpec === 2) { // 多级规格
            const matchedItem = JSON.parse(specDetials || '{}')
            const { mulSpecs, mulSpecPriceList, mulUseImg } = matchedItem
            const idList = mulSpecName2Ids(specName, mulSpecs)
            if (idList.length) {
              const priceItem = getSelectedItemByIdList(idList, mulSpecPriceList)
              retItem.price = priceItem.price
              retItem.spec = specName
              if (mulUseImg === 1) {
                const ret = getMulSpecUrl(idList, mulSpecs, mulSpecPriceList)
                if (ret) retItem.url = getImageUrl(ret)
              }
            }
          }
          ret.push(retItem)
        }
      }
      return ret
    })
    return this.allData
  }

  updateCount(id, spec, count) { // 更新数量
    let localData = this.getLocalData()
    const dataItem = localData[id]
    if (!dataItem) return
    if (!spec) spec = '__default'
    dataItem.countMap[spec] = {count}
    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  updatePrice(id, specName, price) { // 手动更新价格
    let localData = this.getLocalData()
    const data = localData[id]
    if (!specName) {
      data.productInfo.price = price
    } else {
      const {isSpec} = data.productInfo
      const specDetials = JSON.parse(data.productInfo.specDetials || '{}')
      if (isSpec === 1) {
        const singleSpecs = specDetials.singleSpecs || []
        const singleItem = singleSpecs.find((item) => item.name === specName)
        if (!singleItem) return
        singleItem.price = price
      }
      if (isSpec === 2) {
        const mulSpecs = specDetials.mulSpecs || []
        const mulSpecPriceList = specDetials.mulSpecPriceList || []
        const idList = mulSpecName2Ids(specName, mulSpecs)
        if (!idList.length) return
        const priceItem = getSelectedItemByIdList(idList, mulSpecPriceList)
        if (!priceItem) return
        priceItem.price = price
      }
      data.productInfo.specDetials = JSON.stringify(specDetials)
    }
    data.productInfo.modPrice = 1

    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  deleteItem({id, spec}) { // 删除某项
    let localData = this.getLocalData()
    const dataItem = localData[id]
    if (!dataItem) return
    if (!spec) spec = '__default'
    dataItem.countMap[spec] = undefined
    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  updateProdInfo(id, newInfo) { // 更新某个产品信息
    let localData = this.getLocalData()
    const dataItem = localData[id]
    dataItem.countMap = {}
    dataItem.productInfo = newInfo
    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  clearAll() { // 清空清单
    this.setLocalData({})
    this.toggleMap.value = {}
    this.toggleAll.value = !this.toggleAll.value
  }

}

export const shopCarInstance = new ShopCarManage()