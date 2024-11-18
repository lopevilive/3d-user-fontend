import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productMod, getProduct, getShop, countProduct } from '@/http'
import { commonFetch, E_model3D, getBusinessCfg, E_type3D } from '@/util'
import { showConfirmDialog, showToast, showSuccessToast } from 'vant';

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
      modelUrl: '',
      status: 0
    }
  }

  const data = ref(getDefaultData())

  const showModel3d = ref(false)
  const formRef = ref()

  const productTypes = computed(() => {
    return globalData.value.productTypes.map((item) => ({text: item.name, value: item.id}))
  })

  const getContinue = async () => {
    if (id) return false // 编辑产品直接返回
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


  const handleOverCount = async (obj) => {
    const {limit, curr} = obj
    try {
      await showConfirmDialog({
        message: `最多上传 ${limit} 个产品，当前已上传 ${curr} 个。如需上传更多请联系管理员`,
        confirmButtonText: '去联系管理员',
        cancelButtonText: '好的'
      })
      const payload = {
        qrcodeUrl: '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/WechatIMG619.jpg',
        message: `长按识别二维码～`
      }
      let payloadStr = encodeURIComponent(JSON.stringify(payload))
      wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
    } catch(e){}
    console.log(obj)
  }


  const uploadImgsRef = ref()
  const saveHandle = async () => {
    if (uploadImgsRef.value.isLoading) {
      showToast('请等待图片上传完成再保存～')
      return
    }
    await formRef.value.validate()
    const res = await commonFetch(productMod, data.value)
    if (res && Object.prototype.toString.call(res) === '[object Object]') {
      handleOverCount(res)
      return
    }
    showSuccessToast('保存成功～')

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
    router.replace({name: 'product-detial', params: {id: id ? id : res}, query: {title: data.value.name}})
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
    if (data.value.name) return false
    if (!isFocusName.value) return false
    if (!recommendNames.value?.length) return false
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

  const modelDisplayRef = ref()
  const preview3D = async () => {
    modelDisplayRef.value.showModelDisplay()
  }

  // 行业个性字段
  const fieldList = computed(() => {
    const {fields} = busiCfg.value
    if (!fields?.length) return []
    return fields;
  })

  const init = () => {
    getProductInfo()
    getShopInfo()
    // getCount()
  }

  return {
    data,
    formRef,
    saveHandle,
    init,
    model3DDisplay,
    showModel3d,
    model3dOpts,
    validUrl,
    productTypeDialogRef,
    qrcodeScannerRef,
    scanClickHandle,
    scanHandle,
    type3DOpts,
    recommendNames,
    isFocusName,
    isShowRecommendNames,
    nameBlurHandle,
    preview3D,
    modelDisplayRef,
    fieldList,
    uploadImgsRef
  }
}