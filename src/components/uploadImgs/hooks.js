import {computed, ref} from 'vue'
import { uploadFile } from '@/util'
import { useRoute } from 'vue-router'

export const useUploadImages = (props, emits) => {
  const route = useRoute()
  const {shopId} = route.params

  const uploadings = ref([])
  
  const handleUpload = async (file) => {
    uploadings.value.push(file)
    file.status = 'uploading'
    const {Location: url} = await uploadFile(file.file, shopId)
    if (!url) return
    uploadings.value = uploadings.value.filter((item) => {
      if (item === file) return false
      return true
    })
    const uri = `//${url}`
    let list = props.modelValue.split(',')
    list.push(uri)
    list = [...new Set(list)]
    list = list.filter((item) => Boolean(item))
    emits('update:modelValue', list.join(','))
  }
  
  const afterRead = (files) => {
    if (!Array.isArray(files)) files = [files]
    for (const file of files) {
      handleUpload(file)
    }
  }

  const deleteHandle = (file) => {
    const {url} = file
    let newVal = ''
    let list = props.modelValue.split(',')
    for (const item of list) {
      if (item === url) continue
      if (newVal) newVal += ','
      newVal += item
    }
    emits('update:modelValue', newVal)
  }

  const fileList = computed(() => {
    let ret = null
    if (!props.modelValue) {
      ret = []
    } else {
      ret = props.modelValue.split(',').map((url) => {
        return {url}
      })
    }
    if (uploadings.value.length) ret = [...ret, ...uploadings.value]
    return ret;
  })

  const onDrop = (params) => {
    const {removedIndex, addedIndex} = params
    if (removedIndex === undefined || addedIndex === undefined) return
    const list = props.modelValue.split(',')
    const removeItem = list[removedIndex]
    list[removedIndex] = list[addedIndex]
    list[addedIndex] = removeItem
    emits('update:modelValue', list.join(','))
  }


  
  return {
    afterRead,
    deleteHandle,
    fileList,
    onDrop,
    uploadings
  }
}