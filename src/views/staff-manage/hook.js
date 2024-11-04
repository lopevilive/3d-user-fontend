import { ref, computed } from 'vue'
import { commonFetch } from '@/util'
import { getStaff, delStaff } from '@/http'
import { showConfirmDialog } from 'vant';

export const useStaffManage = () => {
  const activeTab = ref(1) // 1管理员-2分销员

  const dataList = ref([])
  let currItem = null
  
  const tabChangeHandle = () => {
    dataList.value = []
    init()
  }

  const showAction = ref(false)
  const settingClickHandle = (item) => {
    currItem = item
    showAction.value = true
  }

  const typeName = computed(() => {
    return activeTab.value === 1 ? '管理员' : '分销员'
  })

  const delHandle = async () => {
    try {
      await showConfirmDialog({
        title: `删除${typeName.value}`,
        message: `确定删除${typeName.value}【${currItem.nickName}】?`
      })
      await commonFetch(delStaff, {id: currItem.id})
      init()
    } catch(e) {}
  }

  const actions = [
    {name: '删除管理员', icon: 'delete-o', color: '#ee0a24', exec: delHandle}
  ]

  const selectHandle = (actionItem) => {
    const {exec} = actionItem
    if (exec) exec()
  }

  const addHandle = async () => {

  }

  const init = async () => {
    try {
      dataList.value = await commonFetch(getStaff, {shopId: 5, type: activeTab.value})
    } catch(e) {
      dataList.value = []
    }
  }

  return {
    activeTab,
    init,
    tabChangeHandle,
    dataList,
    settingClickHandle,
    showAction,
    actions,
    selectHandle,
    typeName,
    addHandle
  }
}