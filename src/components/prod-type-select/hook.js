import { computed, ref } from 'vue'
import { globalData } from '@/store'
import { formatType, sleep, mulTypeInstance, formatPoint } from '@/util'
import { useRouter } from 'vue-router'


export const useProdTypeSelect = (props, emits) => {

  const router = useRouter()

  const productTypes = computed(() => {
    const ret = []
    for (const item of globalData.value.productTypes) {
      if (!item.parentId) {
        ret.push({text: item.name, value: item.id})
      }
    }
    ret.splice(0,0, {text: '无', value: ''})
    return ret
  })
  
  const val = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      if (!val) val = ''
      if (val) val = `,${val},`
      emits('update:modelValue', val)
    }
  })

  const productTypeDialogRef = ref()
  const showTypePicker = ref(false)

  const productTypeDisplay = computed(() => {
    if (mulTypeDisplay.value)  return ''
    if (!props.modelValue) return '点击选择分类'
    const {type1} = formatType(props.modelValue)
    for (const item of productTypes.value) {
      if (item.value === type1) return item.text
    }
    return ''
  })

  
  const showProductTypeDialog = () => {
    productTypeDialogRef.value.show({id: 0, name: ''})
  }

  const isShowSub = computed(() => {
    if (!props.modelValue) return false
    if (mulTypeDisplay.value) return false
    const {type1, type2} = formatType(props.modelValue)
    if (type2) return true
    for (const item of globalData.value.productTypes) {
      if (item.parentId === type1) return true
    }
    return false
  })

  const showSubTypePicker = ref(false)

  const subTypeOpts = computed(() => {
    let ret = []
    const {type1} = formatType(props.modelValue)
    if (!type1) return ret
    for (const item of globalData.value.productTypes) {
      if (item.parentId === type1) {
        ret.push({text: item.name, value: item.id})
      }
    }
    if (ret.length) {
      ret.splice(0,0, {text: '无', value: ''})
    }
    return ret
  })

  const subTypeDisplay = computed({
    get() {
      if (!props.modelValue) return '';
      const {type2} = formatType(props.modelValue)
      for (const item of globalData.value.productTypes) {
        if (item.id === type2) return item.name
      }
      return ''
    },
    set(val) {
      const {type1} = formatType(props.modelValue)
      if (!val) {
        emits('update:modelValue', `,${type1},`)
      } else {
        emits('update:modelValue', `,${type1}-${val},`)
      }
      
    }
  })

  const showSubProductTypeDialog = () => {
    const {type1} = formatType(props.modelValue)
    productTypeDialogRef.value.show({id: 0, name: ''}, false, {
      parentId: type1
    })
  }

  const mulTypeDisplay = computed({
    get() {
      if (props.isMulType ===  1) return true
      return false
    },
    set(val) {
      const tmp = val ? 1 : 0
      emits('update:isMulType', tmp)
      if (tmp === 0) {
        if (props.modelValue) {
          const tmp = props.modelValue.split(',')
          for (const item of tmp) {
            if (!item) continue
            emits('update:modelValue', `,${item},`)
            break
          }
        }
      }
    }
  })

  const toEditMulHandle = async () => {
    globalData.value.prodEditNeedAlive = true
    await sleep(100)
    router.push({name: 'mul-type-manage'})
    const ret = await mulTypeInstance.getPromise(props.modelValue)
    emits('update:modelValue', ret)
  }

  const isShowMul = computed(() => {
    if (props.mode === 1) return false
    return true
  })

  const delHandle = () => {
    emits('del')
  }

  const displayMulTxt = computed(() => {
    let arr = formatPoint(props.modelValue)
    const len = arr.length
    if (len === 0) return '去设置'
    return `已配置 ${len} 个分类`
  })

  const textClickHandle = () => {
    if (props.isMulType) return
    showTypePicker.value = true
  }
  

  return {
    val, productTypeDialogRef, showTypePicker, productTypeDisplay, productTypes, showProductTypeDialog,
    isShowSub, subTypeOpts, showSubTypePicker, subTypeDisplay, showSubProductTypeDialog, mulTypeDisplay,
    toEditMulHandle, isShowMul, delHandle, displayMulTxt, textClickHandle
  }
}