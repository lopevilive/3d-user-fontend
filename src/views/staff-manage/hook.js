import { ref, computed } from 'vue'
import { commonFetch, isInApp, getImageUrl, shopInfoManage } from '@/util'
import { getStaff, delStaff } from '@/http'
import { showConfirmDialog, showToast } from 'vant';
import { useRoute } from 'vue-router'

export const useStaffManage = () => {
  const route = useRoute()
  const shopId = +route.params.shopId
  const activeTab = ref(1) // 1管理员-2分销员

  const dataList = ref([]) // 正常或者待接受人员
  const invalidList = ref([]) // 失效人员
  let currItem = null
  const shopInfo = ref()

  const formatList = () => {
    dataList.value = []
    invalidList.value = []
  }
  
  const tabChangeHandle = () => {
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
      await commonFetch(delStaff, {id: currItem.id, shopId})
      init()
    } catch(e) {}
  }

  const actions = computed(() => {
    const ret = [{name: `删除${activeTab.value === 1? '管理': '分销'}员`, icon: 'delete-o', color: '#ee0a24', exec: delHandle}]
    return ret
  })

  const selectHandle = (actionItem) => {
    const {exec} = actionItem
    if (exec) exec()
  }

  const dialogStaffRef = ref()
  const addHandle = async () => {
    dialogStaffRef.value.open()
  }

  const activeNames = ref([])

  const delAllHandle = async () => {
    setTimeout(() => {
      activeNames.value = [1] // 防止折叠起来
    }, 0);
    try {
      await showConfirmDialog({title:'全部删除', message: '确定删除全部失效人员？'})
      const ids = invalidList.value.map((item) => item.id)
      await commonFetch(delStaff, {id: ids, shopId})
      init()
    } catch(e) {
      init()
    }
  }

  const toInvite = async (data) => {
    const inApp = isInApp()
    if (!inApp) {
      showToast('请在小程序内邀请~')
      return
    }
    if (!shopInfo.value) {
      const ret = await shopInfoManage.getData(shopId)
      shopInfo.value = ret[0]
    }
    const {id: inviteId, nickName} = data
    let {name: shopName, url} = shopInfo.value
    url = url.split(',')[0]
    url = getImageUrl(url)
    const obj = {
      shopName, url, inviteId, nickName, shopId,
      adminName: activeTab.value === 1 ? '管理员' : '分销员'
    }
    const payload = encodeURIComponent(JSON.stringify(obj))
    wx.miniProgram.navigateTo({url: `../invite/invite?payload=${payload}`})
  }

  const handleUpdate = async (data) => {
    init()
    toInvite(data)
  }

  const init = async () => {
    try {
      formatList()
      const list = await commonFetch(getStaff, {shopId, type: activeTab.value})
      for (const item of list) {
        if ([1,4].includes(item.status)) {
          dataList.value.push(item)
        } else {
          invalidList.value.push(item)
        }
      }

    } catch(e) {
      formatList()
    }
  }

  return {
    activeTab, init, tabChangeHandle, dataList, invalidList, settingClickHandle, showAction, actions,
    selectHandle, typeName, addHandle, dialogStaffRef, activeNames, delAllHandle, handleUpdate, toInvite
  }
}
