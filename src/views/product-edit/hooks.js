import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { productMod, getProduct } from '@/http'
import { commonFetch, E_3D_MODELS } from '@/util'
import { showConfirmDialog } from 'vant';

export const useProductEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const {id, shopId} = route.params

  const getDefaultData = () => {
    return {
      id: id ? id : 0,
      shopId,
      url: '',
      imgs: '',
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
    const ret = globalData.value.getProductTypes(shopId).value
    return ret.map((item) => {
      return {
        text: item.name,
        value: item.id
      }
    })
  })

  const productTypeDisplay = computed(() => {
    let {productType} = data.value
    if (!productType) return ''
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
      if (window.history.state.back === window.history.state.current) router.go(-1)
    }, 0);
  }

  const model3DDisplay = computed(() => {
    if (!data.value.model3D) return ''
    for (const item of E_3D_MODELS) {
      if (item.key === data.value.model3D) return item.val
    }
    return ''
  })

  const model3dOpts = computed(() => {
    return E_3D_MODELS.map((item) => {
      return {text: item.val,value: item.key}
    })
  })

  const init = async () => {
    if (!id) return
    const res = await commonFetch(getProduct, {productId: id})
    if (res.list.length) {
      data.value = res.list[0]
    }
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
    model3dOpts
  }
}