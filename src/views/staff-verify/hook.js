import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { commonFetch } from '@/util'
import { verfiyStaff,getShop, acceptStaff } from '@/http'
import { showDialog } from 'vant';


export const useStaffVerify = () => {
  const route = useRoute()
  const router = useRouter()
  const id = +route.params.id
  const shopId = +route.params.shopId
  const shopInfo = ref({})
  const show = ref(false)

  const gohome = () => {
    router.replace({name: 'product-manage', params: {shopId}})
  }

  const verify = async () => {
    if (!id) {
      return false
    }
    try {
      const {status} = await commonFetch(verfiyStaff, {id, shopId})
      return status
    } catch(e) {
      gohome()
    }
  }

  const urlDisplay = computed(() => {
    const {url} = shopInfo.value
    if (!url) return ''
    return url.split(',')[0]
  })

  let reso = null
  const handleDialog = async () => {
    show.value = true
    return new Promise((resolve) => {
      reso = resolve
    })
  }

  const beforeCloseHandle = async (action) => {
    if (action === 'cancel') { // 拒绝成为管理员
      reso(false)
      return true
    }
    if (action === 'confirm') {
      reso(true)
      return true
    }

  }
  
  const handleCreate = async () => {
    const data = await commonFetch(getShop, {shopId})
    shopInfo.value = data?.[0] || {}
    try {
      let pass = await handleDialog()
      if (pass) {
        await commonFetch(acceptStaff, {id})
        showDialog({
          message: `恭喜！您已成功成为【${shopInfo.value.name}】管理员。`,
          confirmButtonText: '返回首页',
          beforeClose: () => {
            gohome()
            return true
          }
        })
      } else {
        gohome()
      }
    } catch(e) {
      gohome()
    }
  }
  
  const init = async () => {
    const status = await verify()
    if (status === false || [2,3,4,5].includes(status)) {
      gohome()
      return
    }
    if (status === 1) { // 过期了
      showDialog({
        title: '邀请已过期',
        message: '邀请已过期，请让对方重新发起邀请～',
        confirmButtonText: '返回首页',
        beforeClose: () => {
          gohome()
          return true
        }
      })
      return
    }
    if (status === 0) {
      handleCreate()
    } else {
      gohome()
    }
  }

  return {
    init,
    show,
    shopInfo,
    urlDisplay,
    beforeCloseHandle
  }

}