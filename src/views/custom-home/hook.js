import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shopInfoManage, formatType, commonFetch, homepageInstance } from '@/util'
import { globalData } from '@/store'
import { getProduct } from '@/http'

export const useCustomHome = () => {
  const route = useRoute()
  const router = useRouter()
  const shopId = +route.params.shopId
  const shopInfo = ref({})
  let inited = false
  const data = ref({
    isEnabled: 2,
    cfg: []
  })

  const pageMode = computed(() => {
    if (route.name === 'custom-home') return 1
    if (route.name === 'custom-home-preview') return 2
    return 0
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

  const viewMoreProd = async () => {
    if (pageMode.value === 2) return
    router.push({name: 'product-manage', params: {shopId}, query: route.query})
  }

  const prodTypeClickHandle = async (itemData) => {
    if (pageMode.value === 2) return // 预览模式不需要跳转
    const { type1 } = formatType(itemData.typeId)
    if (!type1) return
    router.push({name: 'product-manage', params: {shopId}, query: {...route.query, activeType: type1}})
  }
  
  const domRef = ref()
  const activeHandle = async () => {
    if (!inited) {
      inited = true
      return
    }
    if (scrollT.value) { // 这里让页面滚动到上次的位置
      domRef.value.scrollTop = scrollT.value
    }
    if (globalData.value.customHomeNeedUpdate) {
      globalData.value.customHomeNeedUpdate = false
      init()
    }
  }
  
  const formatShopInfo = async () => {
    let ret = await await shopInfoManage.getData(shopId)
    if (ret.length) {
      shopInfo.value = ret[0]
    }
  }
  
  const getCfg = async () => {
    if (pageMode.value === 1) { // 产品首页
      const homePageCfg = JSON.parse(shopInfo.value.homePageCfg || '{}')
      return homePageCfg
    }
    if (pageMode.value === 2) { // 预览
      const ret = homepageInstance.getData()
      return {
        cfg: ret.cfg,
        isEnabled: 1
      }
    }
  }

  const productItemMode = computed(() => {
    let ret = 1<<1 | 1<<2;
    if (pageMode.value === 2) {
      ret = ret | 1<<3
    }
    return ret
  })

  const init = async () => {
    try {
      await formatShopInfo()
      const homePageCfg = await getCfg()
      
      // 检查是否启用自定义首页
      if (homePageCfg.isEnabled === 1) {
        data.value.isEnabled = homePageCfg.isEnabled
        data.value.cfg = homePageCfg.cfg || []

        // 获取自定义产品列表
        const itemCustomProduct = data.value.cfg.find(item => item.comName === 'ItemCustomProduct')
        if (itemCustomProduct && itemCustomProduct.info && itemCustomProduct.info.list && itemCustomProduct.info.list.length > 0) {
          const productIds = itemCustomProduct.info.list.map(item => item.id)
          const products = await getProductList(productIds)
          // 创建 id 到索引的映射
          const idToIndex = {}
          itemCustomProduct.info.list.forEach((item, index) => {
            idToIndex[item.id] = index
          })
          // 将产品详情存储在data中，并按照 itemCustomProduct.info.list 的顺序排序
          data.value.customProducts = products.sort((a, b) => {
            return (idToIndex[a.id] ?? Infinity) - (idToIndex[b.id] ?? Infinity)
          })
        }
      }
    } catch (error) {
      console.error('获取图册信息失败:', error)
    }
  }

  init()

  return {
    data, getBannerList, getTypeName, shopInfo, scrollHandle, activeHandle, domRef, viewMoreProd,
    prodTypeClickHandle, productItemMode, pageMode
  }
}
