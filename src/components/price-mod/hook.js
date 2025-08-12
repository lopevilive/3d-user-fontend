import {ref, computed} from 'vue'
import {shopInfoManage, priceReg, specManageInstance, sleep, getSpecPrices } from '@/util'
import { useRoute, useRouter } from 'vue-router'

export const usePriceMod = (props, emits) =>{

  const route = useRoute()
  const router = useRouter()
  const shopId = +route.params.shopId

  const shopInfo = ref({})

  const specDetials = computed(() => {
    const data = JSON.parse(props.specDetials || '{}')
    return data
  })

  const priceDisplay = computed({
    get() {
      return props.price
    },
    set(val) {
      emits('update:price', val)
    }
  })

  const valiPrice = () => {
    if (props.isSpec === 0)  {
      let price = props.price || ''
      price = price.trim()
      if (!price) return true
      if (!priceReg.test(price)) return '请输入正确价格'
      return true
    }
    if (props.isSpec === 1) {
      if (!specDetials.value.singleSpecs?.length) return '请添加规格'
      return true
    }
    if (props.isSpec === 2) {
      if (!specDetials.value.mulSpecPriceList?.length) return '请添加规格'
      return true
    }
    
  }

  const specType = computed({
    get() {
      return props.isSpec
    },
    set(val) {
      emits('update:isSpec', val)
      emits('resetValidation')
    }
  })

  const toEditSpecHandle = async () =>{
    globalData.value.prodEditNeedAlive = true
    await sleep(100)
    router.push({name: 'spec-edit'})
    try {
      const ret =  await specManageInstance.getPrice({ isSpec: props.isSpec, specDetials: props.specDetials })
      emits('update:specDetials', ret.specDetials)
      emits('update:price', String(ret.price))
      emits('resetValidation')
    } catch(e) {
      console.error(e)
    }
  }

  const displaySpecTxt = computed(() => {
    const singleSpecs = specDetials.value.singleSpecs || []
    const mulSpecPriceList = specDetials.value?.mulSpecPriceList || []
    let list = []
    if (props.isSpec === 1) list = singleSpecs
    if (props.isSpec === 2) list = mulSpecPriceList

    if (!list.length) return '去设置'
    const {min, max} = getSpecPrices(list)
    if (min === '') return `共 ${list.length} 个规格`
    if (min === max) return `共 ${list.length} 个规格｜¥ ${min}`
    return `共 ${list.length} 个规格｜¥ ${min} ~ ${max}`
  })
  
  const init = async () => {
    const res = await shopInfoManage.getData(shopId)
    if (res?.length === 1) shopInfo.value = res[0]
  }

  return {
    shopInfo, init, priceDisplay, valiPrice, specType, toEditSpecHandle, displaySpecTxt
  }
  
}