import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/sotre/index.js'
import { productMod, getProduct } from '@/http/cgi.js'
import { commonFetch, E_3D_MODELS } from '@/util'

export const useProductEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const {id, shopId} = route.params

  const data = ref({
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
  })

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

  const saveHandle = async () => {
    await formRef.value.validate()
    const res = await commonFetch(productMod, data.value, '保存成功')
    const {editStatus} = globalData.value
    if (editStatus === 1) {
      // 编辑状态
      router.replace({name: 'product-manage', params: {shopId}})
      return
    }
    router.replace({name: 'product-detial', params: {id: res?.id}})
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
    const info = await commonFetch(getProduct, {productId: id})
    if (info?.length) data.value = info[0]
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