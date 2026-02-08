import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { shopInfoManage, productTypesManage } from '@/util'
import { showConfirmDialog } from 'vant'


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
  "modules": [
    {
      "comName": "ItemBanner", 
      "status": 2, // 1-启用、2-不启用
      "info": {
        "url": '',
        "scale": "0.33", 
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
  const shopId = + route.params.shopId
  const shopInfo = ref({})

  const data = ref({
    isEnabled: 2,
    cfg: [
      { comName: 'ItemBanner', info: {
        url: '', scale: '0.33', autoPlay: 1
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
      await  showConfirmDialog({
        message: '开启后当前配置将立即生效，且会自动保存，确认开启吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
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

  const init = async () => {
    shopInfo.value = (await shopInfoManage.getData(shopId))[0]
    const homePageCfg = JSON.parse(shopInfo.value.homePageCfg || '{}')

    // 如果有配置信息，则更新默认配置中对应的字段
    if (homePageCfg.isEnabled) {
      data.value.isEnabled = homePageCfg.isEnabled
    }
    if (homePageCfg.modules && homePageCfg.modules.length > 0) { // 已经配置过了
      // 遍历默认配置
      data.value.cfg.forEach(defaultModule => {
        // 在 homePageCfg 中查找对应的模块
        const configModule = homePageCfg.modules.find(
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
      bannerCfg.info.url = shopInfo.value.url
      console.log(data.value, 99)
    }
  }

  init()

  return {
    data,
    moduleConfigDialogRef,
    handleConfigModules,
    COMPONENT_MAP,
    enAbledDisplay
  }
}