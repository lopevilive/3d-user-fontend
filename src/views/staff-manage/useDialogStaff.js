import { ref } from 'vue'
import { commonFetch } from '@/util'
import { createStaff } from '@/http'
import { useRoute } from 'vue-router'


export const useDialogStaff = (props, emits) => {
  const route = useRoute()
  const shopId = +route.params.shopId
  
  const show = ref(false)

  const nickName = ref('')

  const handleCreate = async () => {
    const data = await commonFetch(createStaff, {nickName: nickName.value, type: props.type, shopId})
    emits('update', {id: data.id, nickName: nickName.value})
  }

  const beforeClose = async (action) => {
    if (action === 'cancel') return true
    try {
      await formRef.value.validate()
    } catch(e) {
      return false
    }
    handleCreate()
    return true
  }

  const open = () => {
    nickName.value = ''
    show.value = true
  }
  
  const formRef = ref()
  const validNickName = async () => {
    if (!nickName.value) return '请输入昵称'
    return true
  }

  return {
    show,
    beforeClose,
    open,
    nickName,
    validNickName,
    formRef,
  }
}