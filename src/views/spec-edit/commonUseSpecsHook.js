import {ref, computed} from 'vue'
import { shopInfoManage } from '@/util'
import { useRoute } from 'vue-router'



export const useCommonUseSpecs = (props, emits) => {
  
  const route = useRoute()
  const shopId = +route.params.shopId
  const shopInfo = ref({})
  const specsCfg = computed(() => {
    let specsCfg = shopInfo.value.specsCfg
    if (!specsCfg) return []
    const data = JSON.parse(specsCfg)
    let ret = []
    if (props.isSpec === 1) {
      for (const item of data.singleCfg) {
        let disabled = false
        const idx = props.singleSpecs.findIndex((i) => i.name === item.name)
        if (idx !== -1) disabled = true
        ret.push({...item, disabled})
      }
    }
    if (props.isSpec === 2) {
      for (const item of data.mulCfg) {
        let disabled = false
        const idx = props.mulSpecs.findIndex((i) => i.name === item.name)
        if (idx !== -1) disabled = true
        ret.push({...item, disabled})
      }
    }
    ret = ret.sort((a, b) => {
      if (a.disabled) return 1
      return -1
    })
    return ret
  })
  
  const clickHandle = (data) => {
    emits('add', data)
  }
  
  const init = async () => {
    const ret = await shopInfoManage.getData(shopId)
    shopInfo.value = ret?.[0] || {}
  }

  return {
    init, specsCfg, clickHandle
  }
}