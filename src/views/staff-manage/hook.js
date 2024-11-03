import { ref } from 'vue'



export const useStaffManage = () => {
  const activeTab = ref(1) // 1管理员-2分销员

  return {
    activeTab
  }
}