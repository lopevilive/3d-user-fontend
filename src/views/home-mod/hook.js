import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { shopInfoManage } from '@/util'


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

export const useHomeMod = () => {

  const route = useRoute()
  const shopId = + route.params.shopId
  const shopInfo = ref({})

  const data = ref({
    cfg: [
      { comName: 'ItemBanner', info: {}, status: 1 },
      { comName: 'ItemProductType', info: {}, status: 1 },
      { comName: 'ItemCustomProduct', info: {}, status: 1 },
      { comName: 'ItemHomeDesc', info: {}, status: 1 }
    ]
  })

  const enabledModules = computed(() => {
    return data.value.cfg.filter(item => item.status === 1)
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

  const init = async () => {
    shopInfo.value = (await shopInfoManage.getData(shopId))[0]
    console.log(shopInfo.value)
  }

  init()

  return {
    data,
    enabledModules,
    moduleConfigDialogRef,
    handleConfigModules,
    COMPONENT_MAP
  }
}