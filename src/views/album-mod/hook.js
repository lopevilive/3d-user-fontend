import { ref } from 'vue'
import { shopMod, getShop } from '@/http'
import { commonFetch } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'


export const useAlbumMod = () => {
  const router = useRouter()
  const route = useRoute()
  const {shopId} = route.params

  const data = ref({
    id: shopId ? +shopId : 0, // 0 新建
    name: '',
    desc: '',
    url: '',
    area: ''
  })

  const formRef = ref()
  const areaSelectRef = ref()

  const areaClick = () => {
    areaSelectRef.value.show()
  }

  const saveHandle = async () => {
    await formRef.value.validate()
    const { userId } = globalData.value
    const payload = {...data.value, userId}
    // console.log(payload)
    // return
    const res =  await commonFetch(shopMod, payload, '保存成功')
    router.replace({name: 'product-manage', params: {shopId: res}})
    setTimeout(() => {
      if (window.history.state.back === window.history.state.current) router.go(-1)
    }, 0);
  }

  const init = async () => {
    if (!shopId) return
    const res = await commonFetch(getShop, {shopId})
    if (res?.length) data.value = res[0]
  }

  return {
    data,
    formRef,
    saveHandle,
    init,
    areaSelectRef,
    areaClick
  }
}