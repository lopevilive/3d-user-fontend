import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { shopInfoManage, formatType } from '@/util'
import { globalData } from '@/store'

export const useCustomHome = () => {
  const route = useRoute()
  const shopId = +route.params.shopId
  const shopInfo = ref({})
  const data = ref({
    isEnabled: 2,
    cfg: []
  })

  const init = async () => {
    try {
      shopInfo.value = (await shopInfoManage.getData(shopId))[0]
      const homePageCfg = JSON.parse(shopInfo.value.homePageCfg || '{}')
      console.log(homePageCfg)
      // 检查是否启用自定义首页
      if (homePageCfg.isEnabled === 1) {
        data.value.isEnabled = homePageCfg.isEnabled
        data.value.cfg = homePageCfg.cfg || []
      }
    } catch (error) {
      console.error('获取图册信息失败:', error)
    }
  }

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

  init()

  return {
    data,
    getBannerList,
    getTypeName
  }
}
