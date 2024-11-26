import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { toContactSys } from '@/util'

export const useSysSetting = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = +route.params.shopId

  const toModAlbum = () => {
    router.push({name: 'album-mod', params: {shopId}})
  }

  const toModStaff = () => {
    router.push({name: 'staff-manage'})
  }

  const toViewProtocol = () => {
    router.push({name: 'user-protocol'})
  }

  const init = () => {
    const {rid} = globalData.value
    if (![2,3,99].includes(rid)) {
      router.replace('home')
    }
  }

  return {
    toModAlbum,
    toModStaff,
    toViewProtocol,
    init,
    globalData,
    toContactSys
  }

}