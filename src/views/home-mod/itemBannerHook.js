import { ref, computed } from 'vue'
import { globalData } from '@/store'

export const useItemBanner = () => {
  const MAX_UPLOAD_COUNT = 5

  const scaleColumns = [
    {text: '4:1', value: '0.25'},
    {text: '3:1', value: '0.33'},
    {text: '2:1', value: '0.5'},
    {text: '1:1', value: '1'}
  ]
  
  const data = ref({
    urlList: [{url: ''}],
    scale: '0.33',
    autoPlay: true
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

  const tipsDisplay = computed(() => {
    if (globalData.value.isPC) return '可双击调整图片顺序'
    return '可长按调整图片顺序'
  })

  const isShowScale = ref(false)

  const scaleDisplay = computed(() => {
    for (const item of scaleColumns) {
      if (item.value === data.value.scale) return item.text
    }
    return ''
  })

  

  return {
    data, displayUrl, tipsDisplay, isShowScale, scaleColumns, scaleDisplay, MAX_UPLOAD_COUNT
  }

}