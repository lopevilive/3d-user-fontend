import { ref, computed} from 'vue'
import { productTypesMod } from '@/http'
import { commonFetch, productTypesManage, valiIllegalStr } from '@/util'
import { useRoute } from 'vue-router'
import {showSuccessToast, showFailToast} from 'vant'
import { globalData } from '@/store'

export const useDialogEdit = (emits) => {
  const route = useRoute()
  const {shopId} = route.params
  const MaxNums = 5
  
  const isShow = ref(false)
  const data = ref({})
  const isMul = ref(false)
  const parentId = ref(0)
  const dataList = ref([])
  
  const show = (item, mul = false, payload = {}) => {
    if (!item) return
    isShow.value = true
    data.value = item
    isMul.value = mul
    parentId.value = payload.parentId
    dataList.value = new Array(MaxNums).fill(null).map(() => ({id: 0, name: ''}))
  }

  const tit = computed(() => {
    if (parentId.value) return '新增二级分类'
    if (data.value.id) return '编辑分类'
    return '新增分类'
  })

  const getData = () => {
    let ret = {...data.value, shopId: + shopId}
    if (parentId.value) ret.parentId = parentId.value
    return { data: [ret], shopId }
  }

  const getMulData = () => {
    let ret = dataList.value.filter((item) => item.name)
    ret = ret.map((item) => {
      let tmp = {...item, shopId: +shopId}
      if (parentId.value) tmp.parentId = parentId.value
      return tmp
    })
    return {data: ret, shopId}
  }

  const handleConfirm = async () => {
    const payload = isMul.value ? getMulData(): getData()
    await commonFetch(productTypesMod, payload)
    showSuccessToast('保存成功～')
    globalData.value._productTypes[shopId].done = false
    productTypesManage.dirty(shopId)
    emits('update')
  }

  const valid = () => {
    let msg = ''
    if (isMul.value) { // 添加多个
      msg = '请至少输入一个名称'
      for(const item of dataList.value) {
        if (item.name) msg = ''
        const ret = valiIllegalStr(item.name)
        if (ret) {
          msg = `不能包含【${ret}】等敏感词。`
          break;
        }
      }
    } else { // 添加单个
      if (data.value.name === '') {
        msg = '请输入名称'
      } else {
        const ret = valiIllegalStr(data.value.name)
        if (ret) {
          msg = `不能包含【${ret}】等敏感词。`
        }
      }
    }
    return msg
  }
  

  const beforeClose = async (action) => {
    if (action === 'cancel') return true
    const errmsg = valid()
    if (errmsg) {
      showFailToast(errmsg)
      return false
    }
    handleConfirm()
    return true
  }

  return {
    show,
    isShow,
    data,
    tit,
    beforeClose,
    isMul,
    dataList,
    MaxNums
  }
}