import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productMod, getProduct, getShop, countProduct } from '@/http'
import { commonFetch, E_model3D, getBusinessCfg, E_type3D } from '@/util'
import { showConfirmDialog } from 'vant';

export const useProductEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const id = +route.params.id
  const shopId = +route.params.shopId

  const shopInfo = ref({})

  const busiCfg = computed(() => {
    const {business} = shopInfo.value
    if (!business) return {}
    return getBusinessCfg(business)
  })

  const getDefaultData = () => {
    return {
      id: id ? id : 0,
      shopId,
      url: '',
      name: '',
      price: '',
      productType: '',
      desc: '',
      type3D: 0,
      model3D: 1,
      modelUrl: ''
    }
  }

  const data = ref(getDefaultData())

  const showTypePicker = ref(false)
  const showModel3d = ref(false)
  const formRef = ref()

  const productTypes = computed(() => {
    const ret = globalData.value.getProductTypes(shopId, false).value
    return ret.map((item) => {
      return {
        text: item.name,
        value: item.id
      }
    })
  })

  const productTypeDisplay = computed(() => {
    let {productType} = data.value
    if (!productType) return '点击选择分类'
    productType = +productType
    for (const item of productTypes.value) {
      if (item.value === productType) return item.text
    }
    return ''
  })

  const getContinue = async () => {
    if (id) return false // 编辑商品直接返回
    let ret = false
    try {
      await showConfirmDialog({
        message:'新增成功！是否继续添加？',
        confirmButtonText:'继续添加',
        cancelButtonText: '返回',
      })
      ret = true
    } catch(e) {
      ret = false
    }
    return ret
  }

  const saveHandle = async () => {
    await formRef.value.validate()
    const res = await commonFetch(productMod, data.value, '保存成功')
    const {editStatus} = globalData.value
    globalData.value.productManageNeedUpdate = true
    const keepAdding = await getContinue()

    if (keepAdding) {
      data.value = getDefaultData()
      return
    }
    
    if (editStatus === 1) {
      // 编辑状态
      router.replace({name: 'product-manage', params: {shopId}})
      return
    }
    router.replace({name: 'product-detial', params: {id: id ? id : res?.id}})
    setTimeout(() => {
      console.log('99999')
      if (window.history.state.back === window.history.state.current) router.go(-1)
    }, 0);
  }

  const model3DDisplay = computed(() => {
    if (!data.value.model3D) return ''
    for (const item of E_model3D) {
      if (item.key === data.value.model3D) return item.val
    }
    return ''
  })

  const model3dOpts = computed(() => {
    const {model3D} = busiCfg.value
    if (!model3D?.length) return []
    let res = E_model3D.filter((item) => model3D.includes(item.key))
    res = res.map((item) => {
      return {text: item.val,value: item.key}
    })
    return res
  })

  const validUrl = async (value, rule) => {
    if (!data.value.url) return false
    return true
  }

  const productTypeDialogRef = ref()
  const showProductTypeDialog = async () => {
    productTypeDialogRef.value.show({id: 0, name: ''})
  }

  const qrcodeScannerRef = ref()
  const scanClickHandle = () => {
    qrcodeScannerRef.value.show()
  }

  const scanHandle = (url) => {
    data.value.modelUrl = url
  }

  const type3DOpts = computed(() => {
    const {type3D} = busiCfg.value
    if (!type3D) return []
    const res = E_type3D.filter((item) => {
      if (item.key === 0) return true
      if (type3D.includes(item.key)) return true
      return false
    })
    if (res.length === 1) return []
    return res

  })

  const getProductInfo = async () => {
    if (!id) return
    const res = await commonFetch(getProduct, {productId: id})
    if (res.list.length) {
      data.value = res.list[0]
    }
  }

  const getShopInfo = async () => {
    const res = await commonFetch(getShop, {shopId})
    shopInfo.value = res[0]
  }

  const isFocusName = ref(false)
  const isShowRecommendNames = computed(() => {
    if (!isFocusName.value) return false
    if (!recommendNames.value.length) return false
    return true
  })
  const nameBlurHandle = () => {
    setTimeout(() => {
      isFocusName.value = false 
    }, 0);
  }
  const productCountInfo = ref({})
  const recommendNames = computed(() => {
    let ret = []
    for (const {value, text} of productTypes.value) {
      let count = productCountInfo.value[value]
      if (!count) count = 0
      if (count > 0) count += 1
      ret.push(`${text}${count > 0 ? count : ''}`)
    }
    const {recommendNames: names} = busiCfg.value
    if (!names?.length) return ret
    let count = productCountInfo.value[0]
    if (!count) count = 0
    if (count > 0) count += 1
    for (const item of names) {
      ret.push(`${item}${count > 0 ? count : ''}`)
    }

    return ret
  })

  const getCount = async () => {
    const res = await commonFetch(countProduct, {shopId})
    let ret = {}
    for (const item of res) {
      let key = item.productType
      if (key === '') key = '0'
      ret[key] = + item.total
    }
    productCountInfo.value = ret
  }

  const init = () => {
    getProductInfo()
    getShopInfo()
    // getCount()
  }

  return {
    data,
    showTypePicker,
    formRef,
    productTypes,
    productTypeDisplay,
    saveHandle,
    init,
    model3DDisplay,
    showModel3d,
    model3dOpts,
    validUrl,
    showProductTypeDialog,
    productTypeDialogRef,
    qrcodeScannerRef,
    scanClickHandle,
    scanHandle,
    type3DOpts,
    recommendNames,
    isFocusName,
    isShowRecommendNames,
    nameBlurHandle
  }
}