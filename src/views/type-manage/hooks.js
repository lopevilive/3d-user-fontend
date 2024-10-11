import { ref, computed} from 'vue'
import { productTypesMod } from '@/http'
import { commonFetch } from '@/util'
import { useRoute } from 'vue-router'

export const useDialogEdit = (emits) => {
  const route = useRoute()
  const {shopId} = route.params
  
  const isShow = ref(false)
  const data = ref({})
  
  const show = (item) => {
    if (!item) return
    isShow.value = true
    data.value = item
  }

  const tit = computed(() => {
    if (!data.value) return ''
    const {id} = data.value
    if (id) return '编辑分类'
    return '新增分类'
  })

  const handleConfirm = async () => {
    await commonFetch(productTypesMod, {
      ...data.value,
      shopId: +shopId
    })
    emits('update')
  }
  

  const beforeClose = async (action) => {
    if (action === 'cancel') {
      return true
    }
    if (action === 'confirm') {
      handleConfirm()
      return true
    }


  }

  return {
    show,
    isShow,
    data,
    tit,
    beforeClose,
  }
}