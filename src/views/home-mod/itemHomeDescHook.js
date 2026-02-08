import { computed } from 'vue'
import { globalData } from '@/store'

export const useItemHomeDesc = (props, emits) => {
  const MAX_UPLOAD_COUNT = 5

  const displayUrl = computed({
    get() {
      return props.config?.url || ''
    },
    set(val) {
      emits('update:config', { ...props.config, url: val })
    }
  })

  const tipsDisplay = computed(() => {
    if (globalData.value.isPC) return '可双击调整图片顺序'
    return '可长按调整图片顺序'
  })

  const urlLen = computed(() => {
    const urlStr = props.config?.url || ''
    if (!urlStr) return 0
    const list = urlStr.split(',')
    let ret = 0
    for (const item of list) {
      if (item) ret += 1
    }
    return ret
  })

  return {
    displayUrl,
    MAX_UPLOAD_COUNT,
    urlLen,
    tipsDisplay
  }
}