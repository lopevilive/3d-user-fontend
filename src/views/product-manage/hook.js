import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { productDel } from '@/http/cgi.js'
import { commonFetch } from '@/util/index.js'

export const useProductItem = (emits) => {
  const router = useRouter()

  const isShow = ref(false)

  const actions = [
    {
      name: '修改',
      action: (data) => {
        const {id} = data
        router.push({name: 'product-edit', params: {id}})
      }
    },
    {
      name: '删除',
      action: async (data) => {
        const {id} = data
        await commonFetch(productDel, {id})
        emits('update')
      }
    },
    {
      name: '置顶',
      action: () => {}
    },
    {
      name: '前移'
    }
  ]

  const selectHandle = (item, data) => {
    isShow.value = false
    const {action} = item
    action(data)
  }

  const  settingClickHandle = () => {
    isShow.value = true
  }

  return {
    actions,
    isShow,
    selectHandle,
    settingClickHandle
  }
}