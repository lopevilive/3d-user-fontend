import { ref, computed } from 'vue'
import ItemBanner from './ItemBanner.vue';
import ItemProductType from './ItemProductType.vue'
import ItemCustomProduct from './ItemCustomProduct.vue'
import ItemHomeDesc from './ItemHomeDesc.vue'

const COMPONENT_MAP = {
  ItemBanner,
  ItemProductType,
  ItemCustomProduct,
  ItemHomeDesc
}

export const useHomeMod = () => {
  const data = ref({
    cfg: [
      { comName: 'ItemBanner', info: {}, status: 1 },
      { comName: 'ItemProductType', info: {}, status: 1 },
      { comName: 'ItemCustomProduct', info: {}, status: 1 },
      { comName: 'ItemHomeDesc', info: {}, status: 1 }
    ]
  })

  const getComByName = (name) => {
    return COMPONENT_MAP[name]
  }

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

  return {
    data,
    getComByName,
    enabledModules,
    moduleConfigDialogRef,
    handleConfigModules
  }
}