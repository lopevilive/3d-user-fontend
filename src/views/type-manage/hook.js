import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductTypes, productTypesDel, moveTopProductType } from '@/http'
import { commonFetch } from '@/util'
import { showConfirmDialog } from 'vant';
import { globalData} from '@/store'

export const useTypeManage = () => {
  const route = useRoute()
  const data = computed(() => {
    return [...globalData.value.productTypes]
  })
  const dialogEditRef = ref()
  const shopId= +route.params.shopId
  let currmodItem = null

  const delHandle = async () => {
    try {
      await showConfirmDialog({
        title: '删除分类',
        message: `确定删除【${currmodItem.name}】?`
      })
      await commonFetch(productTypesDel, {id: currmodItem.id, shopId})
      globalData.value._productTypes[shopId].done = false
    } catch (error) {}
  }

  const addHandle = () => {
    dialogEditRef.value.show({id: 0, name: ''}, true)
  }

  const editHandle = () => {
    dialogEditRef.value.show({...currmodItem})
  }

  const moveTop = async () => {
    const payload = {id: currmodItem.id, shopId}
    await commonFetch(moveTopProductType, payload)
    globalData.value._productTypes[shopId].done = false
  }

  const actions = [
    {name: '移到最前', icon: 'back-top',exec: moveTop},
    {name: '修改分类', icon: 'edit', color: '#5794f7', exec: editHandle},
    {name: '删除分类', icon: 'delete-o', color: '#ee0a24', exec: delHandle}
  ]

  const showAction = ref(false)

  const selectHandle = (actionItem) => {
    const {exec} = actionItem
    if (exec) exec()
  }

  const settingClickHandle = (item) => {
    currmodItem = item
    showAction.value = true
  }
  
  return {
    data,
    dialogEditRef,
    addHandle,
    actions,
    showAction,
    selectHandle,
    settingClickHandle
  }
}