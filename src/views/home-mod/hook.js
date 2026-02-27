import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shopInfoManage, productTypesManage, commonFetch, homepageInstance } from '@/util'
import { showConfirmDialog, showToast } from 'vant'
import { getProduct, modShopStatus } from '@/http'
import { globalData } from '@/store'


const COMPONENT_MAP = {
  ItemBanner: defineAsyncComponent({
    loader: () => import('./ItemBanner.vue'),
    delay: 200, // 延迟200ms显示加载状态，避免闪屏
  }),
  ItemProductType: defineAsyncComponent({
    loader: () => import('./ItemProductType.vue'),
    delay: 200,
  }),
  ItemCustomProduct: defineAsyncComponent({
    loader: () => import('./ItemCustomProduct.vue'),
    delay: 200,
  }),
  ItemHomeDesc: defineAsyncComponent({
    loader: () => import('./ItemHomeDesc.vue'),
    delay: 200,
  }),
}

const tmpD = {
  "isEnabled": 1,  // 1-启用、2-不启用
  "cfg": [
    {
      "comName": "ItemBanner", 
      "status": 2, // 1-启用、2-不启用
      "info": {
        "url": '',
        "scale": "0.5", 
        "autoPlay": 1 // 1-自动播放、2-不自动播放
      }
    },
    {
      "comName": "ItemProductType",
      "status": 1,
      "info": {
        "list": [
          { "typeId": "1001", "url": "https://example.com/type_logo1.png" },
          { "typeId": "1002", "url": "https://example.com/type_logo2.png" }
        ]
      }
    },
    {
      "comName": "ItemCustomProduct",
      "status": 1,
      "info": {
        "list": [
          { "id": 99}, 
          { "id": 88 }
        ]
      }
    },
    {
      "comName": "ItemHomeDesc",
      "status": 1,
      "info": {
        "url": '',
      }
    }
  ]
}


export const useHomeMod = () => {

  const route = useRoute()
  const router = useRouter()
  const shopId = + route.params.shopId
  const shopInfo = ref({})

  const data = ref({
    isEnabled: 2,
    cfg: [
      { comName: 'ItemBanner', info: {
        url: '', scale: '0.5', autoPlay: 1
      }, status: 1 },
      { comName: 'ItemProductType', info: {
        list: []
      }, status: 1 },
      { comName: 'ItemCustomProduct', info: {
        list: []
      }, status: 1 },
      { comName: 'ItemHomeDesc', info: {
        url: ''
      }, status: 1 }
    ]
  })

  const moduleConfigDialogRef = ref()

  const handleConfigModules = async () => {
    try {
      const newCfg = await moduleConfigDialogRef.value.show(data.value.cfg)
      data.value.cfg = newCfg
    } catch {
      // 用户取消
    }
  }

  const modEnabled = async (val) => {
    if (val) {
      shopInfoManage.dirty(shopId)
      data.value.isEnabled = 1
    } else {
      data.value.isEnabled = 2
    }
  }
  
  const enAbledDisplay = computed({
    get() {
      if (data.value.isEnabled === 1) return true
      return false
    },
    set(val) {
      modEnabled(val)
    }
    
  })


  const modlueRefs = ref({})
  
  const validCfg = async () => {
    // 检查是否至少有一个启用的模块
    const enabledModules = data.value.cfg.filter(item => item.status === 1)
    if (enabledModules.length === 0) {
      showToast('请至少配置一个模块')
      return false
    }

    for(const key of ['ItemBanner', 'ItemProductType', 'ItemHomeDesc']) {
      const moduleItem = enabledModules.find(item => item.comName === key)
      if (moduleItem) {
        const msg = await modlueRefs.value[key].valid()
        if (msg) {
          showToast(msg)
          return false
        }
      }
    }
    
    // 检查 ItemBanner 模块是否至少上传了1张图片
    const bannerModule = enabledModules.find(item => item.comName === 'ItemBanner')
    if (bannerModule) {
      const urlList = bannerModule.info.url ? bannerModule.info.url.split(',').filter(url => url.trim()) : []
      if (urlList.length === 0) {
        showToast('轮播图模块至少需要上传1张图片')
        return false
      }
    }
    
    // 检查 ItemProductType 模块是否至少添加了一个分类
    const productTypeModule = enabledModules.find(item => item.comName === 'ItemProductType')
    if (productTypeModule) {
      const typeList = productTypeModule.info.list || []
      if (typeList.length === 0) {
        showToast('产品分类模块至少需要添加一个分类')
        return false
      }
    }
    
    // 检查 ItemCustomProduct 模块是否至少选择了一个产品
    const customProductModule = enabledModules.find(item => item.comName === 'ItemCustomProduct')
    if (customProductModule) {
      const productList = customProductModule.info.list || []
      if (productList.length === 0) {
        showToast('产品模块至少需要选择一个产品')
        return false
      }
    }
    
    // 检查 ItemHomeDesc 模块是否至少上传了1张图片
    const homeDescModule = enabledModules.find(item => item.comName === 'ItemHomeDesc')
    if (homeDescModule) {
      const urlList = homeDescModule.info.url ? homeDescModule.info.url.split(',').filter(url => url.trim()) : []
      if (urlList.length === 0) {
        showToast('店铺详情模块至少需要上传1张图片')
        return false
      }
    }

    return true
  }
  
  const saveHandle = async () => {
    const pass = await validCfg()
    if (pass !== true) return
    await showConfirmDialog({
        message: '确认保存当前配置？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
    const homePageCfg = JSON.stringify(data.value)
    await commonFetch(modShopStatus, {shopId, homePageCfg})
    shopInfoManage.dirty(shopId)
    showToast('保存成功～')
    globalData.value.customHomeNeedUpdate = true
    try {
      const footerBarRef = globalData.value.getFooterBarRef()
      footerBarRef.value.init()
    } finally {
      if (data.value.isEnabled === 1) {
        router.replace({name: 'custom-home', params: {shopId: shopId}, query: route.query})
      } else {
        router.replace({name: 'product-manage', params: {shopId: shopId}, query: route.query})
      }
    }
    
  }

  const toPreview = async () => {
    const pass = await validCfg()
    if (pass !== true) return
    homepageInstance.updateData(JSON.parse(JSON.stringify(data.value)))
    globalData.value.homeModNeedAlive = true
    router.push({name: 'custom-home-preview', params: {shopId}, query: route.query})
  }
  
  
  const init = async () => {
    shopInfo.value = (await shopInfoManage.getData(shopId))[0]
    const homePageCfg = JSON.parse(shopInfo.value.homePageCfg || '{}')

    // 如果有配置信息，则更新默认配置中对应的字段
    if (homePageCfg.isEnabled) {
      data.value.isEnabled = homePageCfg.isEnabled
    }
    if (homePageCfg.cfg && homePageCfg.cfg.length > 0) { // 已经配置过了
      // 遍历默认配置
      data.value.cfg.forEach(defaultModule => {
        // 在 homePageCfg 中查找对应的模块
        const configModule = homePageCfg.cfg.find(
          module => module.comName === defaultModule.comName
        )
        
        // 如果找到对应的配置，则更新默认配置
        if (configModule) {
          defaultModule.info = configModule.info || {}
          defaultModule.status = configModule.status || 1
        }
      })
    } else { // 还没配置过，根据图册信息默认生成一份
      const productTypesData = await productTypesManage.getData(shopId)
      const bannerCfg = data.value.cfg.find((item) => item.comName === 'ItemBanner')
      const descCfg = data.value.cfg.find((item) => item.comName === 'ItemHomeDesc')
      // 兼容 url 为空或超过5个的情况
      if (shopInfo.value.url) {
        const urlList = shopInfo.value.url.split(',').filter(url => url.trim())
        bannerCfg.info.url = urlList.slice(0, 5).join(',')
        descCfg.info.url = urlList.slice(0, 5).join(',')
      } else {
        bannerCfg.info.url = ''
      }
      if (productTypesData?.[0]?.list?.length) {
        const typeCfg =  data.value.cfg.find((item) => item.comName === 'ItemProductType')
        let len = 0
        for (const item of productTypesData[0].list) {
          if (item.parentId) continue
          if (len >= 4) continue
          len += 1
          typeCfg.info.list.push({ url: '', typeId: `,${item.id},`})
        }
      }
      const prodRes = await commonFetch(getProduct, {shopId, pageSize: 4, currPage: 0, status: 0})
      if (prodRes?.list?.length) {
         const prodCfg = data.value.cfg.find((item) => item.comName === 'ItemCustomProduct')
         for (const item of prodRes.list) {
          prodCfg.info.list.push({id: item.id})
         }
      }
    }
  }

  init()

  return {
    data, moduleConfigDialogRef, handleConfigModules, COMPONENT_MAP, enAbledDisplay, saveHandle,
    toPreview, modlueRefs
  }
}