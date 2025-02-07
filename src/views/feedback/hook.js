import { ref } from 'vue'
import { showToast, showDialog } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { createFeedback } from '@/http'
import { commonFetch } from '@/util'


export const useFeedback = () => {
  const route = useRoute()
  const router = useRouter()

  const shopId = + route.params.shopId

  const feedbackStr = ref('')
  const uploadImgsRef = ref()
  const url = ref('')
  const contactStr = ref('')
  
  const submit = async () => {
    if (uploadImgsRef.value.isLoading) {
      showToast('请等待图片上传完成再保存～')
      return
    }
    feedbackStr.value = feedbackStr.value.trim()
    if (!feedbackStr.value) {
      showToast('请填写问题和意见～')
      return
    }
    const payload = {
      shopId, url: url.value,
      contact: contactStr.value,
      content: feedbackStr.value
    }
    await commonFetch(createFeedback, payload)
    await showDialog({
      message: '感谢您的反馈~\n我们会认真评估并尽快处理',
      theme: 'round-button',
      confirmButtonText: '确定',
      confirmButtonColor: '#3d8bf2'
    })
    router.go(-1)
  }

  return {
    submit,
    feedbackStr,
    uploadImgsRef,
    url,
    contactStr
  }
}