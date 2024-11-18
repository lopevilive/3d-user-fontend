import { ref, computed } from 'vue'
import { shopCreate, shopMod, getShop } from '@/http'
import { commonFetch, keyReplace, E_business } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { showToast } from 'vant';


export const useAlbumMod = () => {
  const router = useRouter()
  const route = useRoute()
  const {shopId} = route.params

  const isEdit = !!shopId

  const data = ref({
    id: isEdit ? +shopId : 0, // 0 新建
    name: '',
    desc: '',
    url: '',
    area: '',
    address: '',
    phone: '',
    qrcodeUrl: '',
    business: ''
  })

  const formRef = ref()
  const areaSelectRef = ref()

  const areaClick = () => {
    areaSelectRef.value.show()
  }


  const uploadImgsRef = ref()
  const uploadImgsRef2 = ref()
  const saveHandle = async () => {
    if (uploadImgsRef.value.isLoading || uploadImgsRef2.value.isLoading) {
      showToast('请等待图片上传完成再保存～')
      return
    }
    await formRef.value.validate()
    const payload = {...data.value}
    const api = isEdit ? shopMod : shopCreate
    const res =  await commonFetch(api, payload, '保存成功')
    globalData.value.userInfo = {} // 需要重新获取登录信息
    router.replace({name: 'contact', params: {shopId: res}})
    setTimeout(() => {
      console.log('8888888')
      if (window.history.state.back === window.history.state.current) router.go(-1)
    }, 0);
  }

  const businessOpts = keyReplace(E_business,  {key: 'value', val: 'text'})
  const showBusinessPicker = ref(false)
  const businessDisplay = computed(() => {
    const {business} = data.value
    if (!business) return ''
    for (const item of E_business) {
      if (business === item.key) return item.val
    }
    return ''
  })

  const businessTips = computed(() => {
    return '请选择您的所属行业，以便我们为您提供针对性的定制化展示方案。'
    // if (!isEdit) return '请选择您的所属行业，以便我们为您提供针对性的定制化展示方案。'
    // return '所属行业暂时无法手动修改，如需更改，请联系开发员。(15697537900)'
  })

  const businessClick = () => {
    // if (isEdit) return
    showBusinessPicker.value = true
  }

  const init = async () => {
    if (!isEdit) return
    const res = await commonFetch(getShop, {shopId})
    if (res?.length) data.value = res[0]
  }


  return {
    data,
    formRef,
    saveHandle,
    init,
    areaSelectRef,
    areaClick,
    businessOpts,
    showBusinessPicker,
    businessDisplay,
    isEdit,
    businessTips,
    businessClick,
    uploadImgsRef,
    uploadImgsRef2
  }
}