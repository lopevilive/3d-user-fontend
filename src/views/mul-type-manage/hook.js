import { ref } from 'vue'
import { mulTypeInstance, formatPoint } from '@/util'
import { globalData } from '@/store'
import { useRouter } from 'vue-router'

export const useMulTypeManage = () => {
  const router = useRouter()

  const list = ref([])
  
  const beforeDestory = async () => {
    mulTypeInstance.destory()
    setTimeout(() => {
      globalData.value.prodEditNeedAlive = false
    }, 300);
  }

  const cancelHandle = async () => {
    await mulTypeInstance.cancel()
    router.go(-1)
  }

  const saveHandle = async () => {
    let ret = ''
    const s = new Set()
    for (const item of list.value) {
      if (!item.val) continue
      const val = item.val.replaceAll(',','')
      if (s.has(val)) continue
      s.add(val)
    }
    const tmpList = [...s]
    ret = tmpList.join(',')
    if (ret) {
      ret = `,${ret},`
    }
    mulTypeInstance.updateData(ret)
    await mulTypeInstance.finish()
    router.go(-1)
  }

  const addHandle = () => {
    list.value.push({val: ''})
  }

  const delHandle = (idx) => {
    list.value.splice(idx, 1)
  }
  
  const init = async ()=> {
    const ret = mulTypeInstance.getData()
    if (!ret) {
      list.value = [{val: ''}]
    }
    if (ret) {
      const arr = formatPoint(ret)
      for (const item of arr) {
        list.value.push({val:  item})
      }
    }
  }
  

  return {
    beforeDestory, cancelHandle, saveHandle, init, list, addHandle, delHandle
  }
  
  
  
}