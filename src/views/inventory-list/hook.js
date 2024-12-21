import { shopCarInstance } from '@/store'
import { showConfirmDialog } from 'vant'
import { useRouter } from 'vue-router'

export const useInventoryList = () => {
  const router = useRouter()

  const shopCarList = shopCarInstance.getAllData()

  const handleUpdateCount = (item, val) => {
    val = Number(val)
    if (val > 0) {
      shopCarInstance.updateCount(item.id, item.spec, val)
    }
  }

  const deleteItem = (item) => {
    shopCarInstance.deleteItem(item)
  }

  const clearAllHandle = async () => {
    await showConfirmDialog({
      message:'确定清空清单？',
      confirmButtonText:'确定',
      cancelButtonText: '取消',
    })
    shopCarInstance.clearAll()
    router.go(-1)
  }

  return {
    shopCarList,
    handleUpdateCount,
    deleteItem,
    clearAllHandle
  }
}