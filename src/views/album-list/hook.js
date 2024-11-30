import { ref } from 'vue'
import { commonFetch } from '@/util'
import { getAllShop } from '@/http'



export const useAblumList = () => {

  const currPage = ref(0)
  const albumList = ref([])

  const loadHandle = async () => {
    fetchLoadingRaw.value = true
    const data = await commonFetch(getAllShop, {
      currPage: currPage.value,
      pageSize: 12
    })
    fetchLoadingRaw.value = false
    if (data.finished) finished.value = data.finished
    currPage.value += 1
    for (const item of data.list) {
      albumList.value.push(item)
    }
  }

  const finished = ref(false)
  const fetchLoadingRaw = ref(false)

  const scrollHandle = (e) => {
    const {scrollTop, clientHeight, scrollHeight} = e.target
    const a = scrollTop + clientHeight
    const b = scrollHeight
    if (Math.abs(b - a) < 10){
      if (finished.value) return
      if (fetchLoadingRaw.value) return
      loadHandle()
    }
  }

  return {
    scrollHandle,
    loadHandle,
    albumList
  }
}