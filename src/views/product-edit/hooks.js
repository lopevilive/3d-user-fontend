import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productMod, getProduct } from '@/http'
import {
  commonFetch, E_model3D, getBusinessCfg, E_type3D, shopInfoManage, toVip, vipInfoManage
} from '@/util'
import { showConfirmDialog, showToast, showSuccessToast } from 'vant';

export const useProductEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const id = +route.params.id
  const shopId = +route.params.shopId

  const shopInfo = ref({})
  const vipInfo = ref()

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
      isSpec: 0,
      specDetials: '',
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


  const dialogVipRef = ref()
  const handleOverCount = async (obj) => {
    const {limit, curr} = obj
    if (limit) {
      dialogVipRef.value.show()
    }
  }

  const getPayload = () => {
    const payload = {...data.value}
    let attr = payload.attr || '[]'
    attr = JSON.parse(attr)
    attr = attr.filter((item) => {
      if (!item.val) return false
      return true
    })
    payload.attr = JSON.stringify(attr)
    return payload
  }

  const uploadImgsRef = ref()
  const saveHandle = async () => {
    if (uploadImgsRef.value.isLoading) {
      showToast('请等待图片上传完成再保存～')
      return
    }
    await formRef.value.validate()
    const payload = getPayload()
    // handleSpecCfg(payload, shopId) // 更新多规格的配置 todo
    const res = await commonFetch(productMod, payload)
    if (res && Object.prototype.toString.call(res) === '[object Object]') {
      handleOverCount(res)
      return
    }
    showSuccessToast('保存成功～')

    const {editStatus} = globalData.value
    globalData.value.productNeedExec.push({type: 'edit', data: data.value})
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
    router.replace({name: 'product-detial', params: {id: id ? id : res}, query: {title: data.value.desc}})
    setTimeout(() => {
      if (/product-detial/.test(window.history.state.back)) {
        router.go(-1)
      }
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
    const res = await shopInfoManage.getData(shopId)
    shopInfo.value = res[0]
  }

  const modelDisplayRef = ref()
  const preview3D = async () => {
    modelDisplayRef.value.showModelDisplay()
  }

  const imgCount = computed(() => {
    if (!data.value.url) return 0
    return data.value.url?.split?.(',')?.length || 0
  })

  const maxCount = computed(() => {
    const cfg = vipInfo.value?.cfg
    const level = vipInfo.value?.level
    if (!cfg) return 6
    const matchItem = cfg.find((item) => item.level === level)
    return matchItem.imgC
  })

  const maxSize = computed(() => {
    if ([516].includes(shopId)) return 40 // 特殊逻辑
    const cfg = vipInfo.value?.cfg
    const level = vipInfo.value?.level
    if (!cfg) return 10
    const matchItem = cfg.find((item) => item.level === level)
    if (!matchItem) return 10
    return matchItem.imgS;
  })

  const goVip = () => {
    toVip(shopId)
  }

  const getVipInfo = async () => {
    const ret = await vipInfoManage.getData(shopId)
    vipInfo.value = ret[0]
  }

  const handleResetValidation = () => {
    formRef.value.resetValidation()
  }
  
  const init = () => {
    getProductInfo()
    getShopInfo()
    getVipInfo()
  }

  return {
    data, formRef, saveHandle, init, model3DDisplay, showModel3d, model3dOpts, validUrl, qrcodeScannerRef,
    scanClickHandle, scanHandle, type3DOpts, preview3D, modelDisplayRef, uploadImgsRef, busiCfg, maxCount,
    imgCount, maxSize, dialogVipRef, goVip, handleResetValidation
  }
}