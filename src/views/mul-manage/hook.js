import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commonFetch, sleep, getImageUrl, shopInfoManage } from '@/util'
import { getInventory, getProduct } from '@/http'

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
    }

    async exe () {
      this.runing = true
      while(this.taskList.length) {
        let nums = 4
        if (leftList.value.length === 0) nums = 7
        const list = this.taskList.splice(0, nums)
        handleRes(list)
        await sleep(500)
      }
      this.runing = false
    }

    add(list) {
      for (const item of list) {
        this.taskList.push(item)
      }
      if (!this.runing) this.exe()
    }

    clear() {
      this.taskList = []
    }
  }

  const listManage = new ListManage()

  const handleRes = async (list) => {
    let leftIdx = 0
    let rightIdx = 0
    const lH = parseInt(window.getComputedStyle(leftListRef.value).height) // 左列表高度
    const rH =  parseInt(window.getComputedStyle(rightListRef.value).height) // 右列表高度
    const total = leftList.value.length + rightList.value.length
    const aver = (lH + rH) / total // 平均每个产品的高度
    const gap = Math.abs(rH - lH) // 左右高度差
    let num =  gap / aver
    if (isNaN(num)) num = 0
    if (num === 1) num = 0
    num = Math.floor(num)
    if (!num) num = 0
    if (lH > rH) {
      rightIdx += (num + 1)
    } else {
      leftIdx += num
    }
    for (const item of list) {
      if (leftIdx >= rightIdx) {
        leftList.value.push(item)
        rightIdx += 1
      } else {
        rightList.value.push(item)
        leftIdx += 1
      }
    }
  }

  const getData = async () => {
    let ret = await commonFetch(getInventory, { id, type: 1 })
    if (!ret.length) return
    ret = ret[0]
    const data = JSON.parse(ret.data)
    let s = new Set()
    for (const item of data.list) {
      s.add(item.id)
    }
    const productId = [...s]
    if (!productId.length) return
    let productData = await commonFetch(getProduct, {shopId, productId, pageSize: 500})
    const { list } = productData
    try {
      for (const item of data.list) {
        if (!item.modPrice) continue
        for (const matchItem of list) {
          if (matchItem.id !== item.id) continue
          if (!item.spec) {
            matchItem.price = item.price
          } else {
            let specs = JSON.parse(matchItem.specs)
            for (const specItem of specs) {
              if (specItem.name === item.spec) {
                specItem.price = item.price
              }
            }
            matchItem.specs = JSON.stringify(specs)
          }
        }
      }
    } catch(e) {
      console.error(e)
    }
    listManage.add(list)
  }

  const setTitle = async () => {
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    const {name, url} = shopInfo
    router.replace({name: 'mul-manage', params: route.params, query: {
      title: name,
      imageUrl: getImageUrl(url?.split(',')?.[0] || '')
    }})
  }
  
  const init = () => {
    getData()
    setTitle()
  }

  init()

  return {
    leftList,
    rightList,
    leftListRef,
    rightListRef
  }

}