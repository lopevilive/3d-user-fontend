import { ref } from 'vue'
import { commonFetch } from '@/util'
import { getAllShop } from '@/http'

export const useAblumList = () => {

  const currPage = ref(0)
  const albumList = ref([])
  const scrollT = ref(0)
  const listRef = ref()

  const searchCond = ref({
    str: '',
    shopId: '',
    status: '',
    auditing: ''
  })

  const loadHandle = async () => {
    fetchLoadingRaw.value = true
    const data = await commonFetch(getAllShop, {
      currPage: currPage.value, pageSize: 12,
      ...searchCond.value
    })
    fetchLoadingRaw.value = false
    if (data.finished) finished.value = data.finished
    currPage.value += 1
    for (const item of data.list) {
      albumList.value.push(item)
    }
  }

  const initLoad = () => {
    currPage.value = 0
    albumList.value = []
    finished.value = false
    loadHandle()
  }

  const finished = ref(false)
  const fetchLoadingRaw = ref(false)

  const scrollHandle = (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    scrollT.value = scrollTop
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 10){
      if (finished.value) return
      if (fetchLoadingRaw.value) return
      loadHandle()
    }
  }

  const activeHandle = () => {
    if (scrollT.value) {
      listRef.value.scrollTop = scrollT.value
    }
  }

  return {
    scrollHandle,
    loadHandle,
    albumList,
    activeHandle,
    listRef,
    searchCond,
    initLoad
  }
}