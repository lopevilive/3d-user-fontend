import {ref, computed} from 'vue'
import { shopInfoManage, specManageInstance } from '@/util'
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
  
  const isShow = ref(false)
  const dialogList = ref([])
  const handleHistory = async () => {
    dialogList.value = []
    for (const item of specsCfg.value) {
      dialogList.value.push(item.name)
    }
    isShow.value = true
  }

  const delHandle = async (name) => {
    const idx = dialogList.value.findIndex((item) => item === name)
    if (idx === -1) return
    dialogList.value.splice(idx, 1)
  }
  
  const beforeClose = async (action) => {
    if (action === 'cancel') {
      return true
    }
    let specsCfg = shopInfo.value.specsCfg
    if (!specsCfg) {
      specsCfg = {singleCfg: [], mulCfg: []}
    } else{
      specsCfg = JSON.parse(specsCfg)
    }
    const list = []
    const tmpList = props.isSpec === 1 ? specsCfg.singleCfg : specsCfg.mulCfg
    for  (const item of tmpList) {
      if (dialogList.value.includes(item.name)) list.push(item)
    }
    if (props.isSpec === 1) {
      specsCfg.singleCfg = list
    } else {
      specsCfg.mulCfg = list
    }
    await specManageInstance.updateSpecsCfg(JSON.stringify(specsCfg), shopId)
    await init()
    return true
  }
  
  const init = async () => {
    const ret = await shopInfoManage.getData(shopId)
    shopInfo.value = ret?.[0] || {}
  }

  return {
    init, specsCfg, clickHandle, isShow, handleHistory, dialogList, delHandle, beforeClose
  }
}