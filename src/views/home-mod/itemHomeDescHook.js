import { ref, computed } from 'vue'
import { globalData } from '@/store'

export const useItemHomeDesc = () => {
  const MAX_UPLOAD_COUNT = 5

  const data = ref({
    urlList: [{url: ''}]
  })

  const displayUrl = computed({
    get() {
      let str = ''
      for (const item of data.value.urlList) {
        if (!item.url) continue
        if (str) str += ',';
        str += item.url
      }
      return str
    },
    set(val) {
      const arr = val.split(',')
      const urlList = arr.map((url) => {
        return {url}
      })
      data.value.urlList = urlList
    }
  })

  return {
    data,
    displayUrl,
    MAX_UPLOAD_COUNT
  }
}