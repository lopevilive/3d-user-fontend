import { computed, ref } from 'vue'
import router from '@/router/index.js'
import { getImageUrl } from '@/util'

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

  getLocalData() {
    const route = router.currentRoute.value
    const {shopId} = route.params
    let localData = localStorage.getItem(`shopCar-${shopId}`) || '{}'
    localData = JSON.parse(localData)
    return localData
  }

  setLocalData(data) {
    const route = router.currentRoute.value
    const {shopId} = route.params
    localStorage.setItem(`shopCar-${shopId}`, JSON.stringify(data))
  }

  getData(productInfo, specName = '__default') {
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
                that.toggleMap.value[id] = !that.toggleMap.value?.[id]
                that.toggleAll.value = !that.toggleAll.value
                let data = that.getLocalData()
                let dataItem = data[id]
                if (dataItem?.productInfo) {
                  if (dataItem.productInfo.upd_time !== upd_time) { // 商品被修改过了
                    dataItem.countMap = {}
                    dataItem.productInfo = productInfo
                  }
                }
                if (!dataItem) {
                  dataItem = {
                    productInfo,
                    countMap: {}
                  }
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

  getAllData () {
    if (this.allData) return this.allData
    this.allData = computed(() => {
      if (this.toggleAll.value) {}
      let localData = this.getLocalData()
      let ret = []
      localData = Object.values(localData)
      for (const item of localData) {
        const {countMap, productInfo: {desc, url, id, isSpec, specs, price, upd_time, modPrice}} = item
        const keys = Object.keys(countMap)
        for (const key of keys) {
          let count = countMap?.[key]?.count || 0
          if (count <= 0) continue
          const retItem = { id, count, upd_time, price,url: getImageUrl(url.split(',')[0]), spec: '', desc}
          if (modPrice) retItem.modPrice = modPrice
          if (isSpec === 1) {
            let specsList = JSON.parse(specs || '[]')
            for (const item of specsList) {
              if (item.name === key) {
                retItem.price = item.price,
                retItem.spec = item.name
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

  updateCount(id, spec, count) {
    let localData = this.getLocalData()
    const dataItem = localData[id]
    if (!dataItem) return
    if (!spec) spec = '__default'
    dataItem.countMap[spec] = {count}
    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  updatePrice(id, spec, price) {
    let localData = this.getLocalData()
    const data = localData[id]
    if (!spec) {
      data.productInfo.price = price
    } else {
      let {specs} = data.productInfo
      specs = JSON.parse(specs)
      for (const item of specs) {
        if (item.name === spec) {
          item.price = price
        }
      }
      data.productInfo.specs = JSON.stringify(specs)
    }
    data.productInfo.modPrice = 1

    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  deleteItem({id, spec}) {
    let localData = this.getLocalData()
    const dataItem = localData[id]
    if (!dataItem) return
    if (!spec) spec = '__default'
    dataItem.countMap[spec] = undefined
    this.setLocalData(localData)
    this.toggleMap.value[id] = !this.toggleMap.value?.[id]
    this.toggleAll.value = !this.toggleAll.value
  }

  clearAll() {
    this.setLocalData({})
    this.toggleMap.value = {}
    this.toggleAll.value = !this.toggleAll.value
  }

}

export const shopCarInstance = new ShopCarManage()