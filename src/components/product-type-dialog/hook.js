import { ref, computed} from 'vue'
import { productTypesMod } from '@/http'
import { commonFetch } from '@/util'
import { useRoute } from 'vue-router'
import {initProductTypes} from '@/store'
import {showSuccessToast, showFailToast} from 'vant'

export const useDialogEdit = (emits) => {
  const route = useRoute()
  const {shopId} = route.params
  
  const isShow = ref(false)
  const data = ref({})
  const isMul = ref(false)
  const dataList = ref([])
  
  const show = (item, mul = false) => {
    if (!item) return
    isShow.value = true
    data.value = item
    isMul.value = mul
    dataList.value = new Array(5).fill(null).map(() => ({id: 0, name: ''}))
  }

  const tit = computed(() => {
    if (!data.value) return ''
    const {id} = data.value
    if (id) return '编辑分类'
    return '新增分类'
  })

  const getData = () => {
    return {
      data: [{...data.value, shopId: + shopId}],
    }
  }

  const getMulData = () => {
    return {
      data: dataList.value.filter((item) => item.name).map((item) => ({...item, shopId: +shopId})),
    }
  }

  const handleConfirm = async () => {
    const payload = isMul.value ? getMulData() : getData()
    await commonFetch(productTypesMod, payload)
    showSuccessToast('保存成功～')
    initProductTypes()
    emits('update')
  }

  const valid = () => {
    let msg = ''
    if (isMul.value) { // 添加多个
      msg = '请至少输入一个名称'
      for(const item of dataList.value) {
        if (item.name) msg = ''
      }
    } else {
      if (data.value.name === '') {
        msg = '请输入名称'
      }
    }
    return msg
  }
  

  const beforeClose = async (action) => {
    if (action === 'cancel') {
      return true
    }
    if (action === 'confirm') {
      const errmsg = valid()
      if (errmsg) {
        showFailToast(errmsg)
        return false
      }
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
    isMul,
    dataList
  }
}