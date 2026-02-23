import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shopInfoManage, formatType, commonFetch } from '@/util'
import { globalData } from '@/store'
import { getProduct } from '@/http'

export const useCustomHome = () => {
  const route = useRoute()
  const router = useRouter()
  const shopId = +route.params.shopId
  const shopInfo = ref({})
  const data = ref({
    isEnabled: 2,
    cfg: []
  })


  // 将逗号分隔的URL字符串转换为数组
  const getBannerList = (urlStr) => {
    if (!urlStr) return []
    return urlStr.split(',').filter(url => url.trim())
  }

  // 通过 typeId 获取分类名称
  const getTypeName = (typeId) => {
    const { type1 } = formatType(typeId)
    for (const item of globalData.value.productTypes) {
      if (item.id === type1) return item.name
    }
    return ''
  }

  // 获取产品列表
  const getProductList = async (productIds) => {
    if (!productIds || productIds.length === 0) return []
    try {
      const res = await commonFetch(getProduct, {shopId, productId: productIds})
      return res.list || []
    } catch (error) {
      console.error('获取产品列表失败:', error)
      return []
    }
  }

  const scrollT = ref(0)
  const scrollHandle = (e) => {
     const {scrollTop} = e.target
      scrollT.value = scrollTop
  }

  const domRef = ref()
  const activeHandle = async () => {
    if (scrollT.value) { // 这里让页面滚动到上次的位置
      domRef.value.scrollTop = scrollT.value
    }
    if (globalData.value.customHomeNeedUpdate) {
      globalData.value.customHomeNeedUpdate = false
      init()
    }
  }

  const viewMoreProd = async () => {
    router.replace({name: 'product-manage', params: {shopId}, query: route.query})
  }

  const prodTypeClickHandle = async (itemData) => {
    const { type1 } = formatType(itemData.typeId)
    if (!type1) return
    router.replace({name: 'product-manage', params: {shopId}, query: {...route.query, activeType: type1}})
    console.log(type1)
  }
  
  const init = async () => {
    try {
      shopInfo.value = (await shopInfoManage.getData(shopId))[0]
      const homePageCfg = JSON.parse(shopInfo.value.homePageCfg || '{}')
      // 检查是否启用自定义首页
      if (homePageCfg.isEnabled === 1) {
        data.value.isEnabled = homePageCfg.isEnabled
        data.value.cfg = homePageCfg.cfg || []
        
        // 获取自定义产品列表
        const itemCustomProduct = data.value.cfg.find(item => item.comName === 'ItemCustomProduct')
        if (itemCustomProduct && itemCustomProduct.info && itemCustomProduct.info.list && itemCustomProduct.info.list.length > 0) {
          const productIds = itemCustomProduct.info.list.map(item => item.id)
          const products = await getProductList(productIds)
          // 将产品详情存储在data中
          data.value.customProducts = products
        }
      }
    } catch (error) {
      console.error('获取图册信息失败:', error)
    }
  }

  init()

  return {
    data, getBannerList, getTypeName, shopInfo, scrollHandle, activeHandle, domRef, viewMoreProd,
    prodTypeClickHandle
  }
}
