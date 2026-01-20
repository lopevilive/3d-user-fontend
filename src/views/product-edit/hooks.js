import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productMod, getProduct } from '@/http'
import { commonFetch, getBusinessCfg, shopInfoManage } from '@/util'
import { showConfirmDialog, showSuccessToast } from 'vant';

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
      name: '', // 弃用
      shopId,
      url: '',
      price: '',
      isSpec: 0,
      specDetials: '',
      productType: '',
      desc: '',
      type3D: 0,
      model3D: 1,
      modelUrl: '',
      status: 0,
      descUrl: '',
      isMulType: 0
    }
  }

  const data = ref(getDefaultData())

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

  const saveHandle = async () => {
    await formRef.value.validate() // 前端校验
    const payload = getPayload()
    if (['develop', 'trial'].includes(globalData.value.wxEnv)) { // 只需在开发/体验环境需要主动调审核接口，方便审核人员查看
      const ret = await secCheckRef.value.check(payload)
      if (ret === false) return
    }
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

  const qrcodeScannerRef = ref()
  const scanClickHandle = () => {
    qrcodeScannerRef.value.show()
  }

  const scanHandle = (url) => {
    data.value.modelUrl = url
  }

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

  const handleResetValidation = () => {
    formRef.value.resetValidation()
  }

  const secCheckRef = ref()
  
  const init = () => {
    getProductInfo()
    getShopInfo()
  }

  return {
    data, formRef, saveHandle, init, qrcodeScannerRef, scanClickHandle, scanHandle,
    busiCfg, dialogVipRef, handleResetValidation, secCheckRef
  }
}