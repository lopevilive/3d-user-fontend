import { ref, computed } from 'vue'
import { globalData } from '@/store'

export const useItemBanner = (props, emits) => {
  const MAX_UPLOAD_COUNT = 5

  const scaleColumns = [
    {text: '4:1', value: '0.25'},
    {text: '3:1', value: '0.33'},
    {text: '2:1', value: '0.5'},
    {text: '1:1', value: '1'}
  ]


  const displayUrl = computed({
    get() {
      return props.config.url
    },
    set(url) {
      const obj = {...props.config, url}
      emits('update:config', obj)
    }
  })

  const urlLen = computed(() => {
    const list = props.config.url.split(',')
    let ret = 0
    for (const item of list) {
      if (item) ret += 1
    }
    return ret
  })

  const tipsDisplay = computed(() => {
    if (globalData.value.isPC) return '可双击调整图片顺序'
    return '可长按调整图片顺序'
  })

  const isShowScale = ref(false)

  const scaleTxt = computed(() => {
    for (const item of scaleColumns) {
      if (item.value === props.config.scale) return item.text
    }
    return ''
  })

  const scaleDisplay = computed({
    get() {
      return props.config.scale
    },
    set(scale) {
      const obj = {...props.config, scale}
      emits('update:config', obj)
    }
  })

  const autoPlayDisplay = computed({
    get() {
      if (props.config.autoPlay === 1) return true
      return false
    },
    set(val) {
      const autoPlay = val ? 1 : 2
      const obj = {...props.config, autoPlay}
      emits('update:config', obj)
    }
  })


  return {
    displayUrl, tipsDisplay, isShowScale, scaleColumns, scaleTxt, MAX_UPLOAD_COUNT, urlLen,
    scaleDisplay, autoPlayDisplay
  }

}