import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { productTypesDel } from '@/http'
import { commonFetch, productTypesManage } from '@/util'
import { showConfirmDialog } from 'vant';
import { globalData} from '@/store'

export const useTypeManage = () => {
  const route = useRoute()

  const displayTypes = computed(() => {
    let ret = []
    for (const item of globalData.value.productTypes) {
      if (!item.parentId) ret.push(item)
    }
    return ret
  })

  const activeNames = ref([])

  const dialogEditRef = ref()
  const shopId= +route.params.shopId
  const currmodItem = ref()

  const delHandle = async () => {
    try {
      await showConfirmDialog({
        title: '删除分类',
        message: `确定删除【${currmodItem.value.name}】?`
      })
      await commonFetch(productTypesDel, {id: currmodItem.value.id, shopId})
      globalData.value._productTypes[shopId].done = false
      productTypesManage.dirty(shopId)
    } catch (error) {}
  }

  const addHandle = () => {
    dialogEditRef.value.show({id: 0, name: ''}, true)
  }

  const editHandle = () => {
    dialogEditRef.value.show({...currmodItem.value})
  }

  const addSubType = () => {
    dialogEditRef.value.show({id: 0, name: ''}, true, {
      parentId:currmodItem.value.id,
      title: '新增二级分类'
    })
  }

  const dialogSortRef = ref()
  const modSort = async () => {
    const { parentId } = currmodItem.value
    let list = []
    if (!parentId) {
      for (const item of globalData.value.productTypes) {
        if (!item.parentId) list.push({...item})
      }
    } else {
      for (const item of globalData.value.productTypes) {
        if (item.parentId === parentId) list.push({...item})
      }
    }
    dialogSortRef.value.show(list)
  }
  
  const actions = computed(() => {
    let ret = [
      {name: '修改分类', icon: 'edit', color: '#5794f7', exec: editHandle},
      {name: '调整顺序', icon: 'exchange', exec: modSort},
      {name: '删除分类', icon: 'delete-o', color: '#ee0a24', exec: delHandle}
    ]
    if (currmodItem.value?.parentId === 0) {
      ret = [{name: '新增二级分类', icon: 'plus', color: '#64b486', exec: addSubType}, ...ret]
    }
    return ret
  })

  const showAction = ref(false)

  const selectHandle = (actionItem) => {
    const {exec} = actionItem
    if (exec) exec()
  }

  const settingClickHandle = (item) => {
    currmodItem.value = item
    showAction.value = true
  }

  const isShowColl = (item) => {
    if (item.parentId !== 0) return false
    for (const typeItem of globalData.value.productTypes) {
      if (typeItem.parentId === item.id) return true
    }
    return false
  }

  const getSubTypes = (data) => {
    const {id} = data
    let ret = []
    for (const item of globalData.value.productTypes) {
      if (item.parentId === id) ret.push(item)
    }
    return ret
  }

  
  return {
    displayTypes,
    dialogEditRef,
    addHandle,
    actions,
    showAction,
    selectHandle,
    settingClickHandle,
    isShowColl,
    activeNames,
    getSubTypes,
    dialogSortRef
  }
}