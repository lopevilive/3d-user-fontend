import { ref, computed } from 'vue'
import { commonFetch } from '@/util'
import { getStaff, delStaff, createStaff } from '@/http'
import { showConfirmDialog } from 'vant';
import { useRoute, useRouter } from 'vue-router'

export const useStaffManage = () => {
  const route = useRoute()
  const shopId = +route.params.shopId
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

  const dialogStaffRef = ref()
  const addHandle = async () => {
    dialogStaffRef.value.open()
  }

  const init = async () => {
    try {
      dataList.value = await commonFetch(getStaff, {shopId, type: activeTab.value})
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
    addHandle,
    dialogStaffRef
  }
}


export const useDialogStaff = (props) => {
  const route = useRoute()
  const shopId = +route.params.shopId
  
  const show = ref(false)

  const nickName = ref('')

  const handleCreate = async () => {
    const data = await commonFetch(createStaff, {nickName: nickName.value, type: props.type, shopId})
    // todo 此处提示去分享
    console.log(data)
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
    formRef
  }
}