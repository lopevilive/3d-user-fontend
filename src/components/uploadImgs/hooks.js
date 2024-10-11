import {computed, ref} from 'vue'
import { uploadFile } from '@/util'

export const useUploadImages = (props, emits) => {

  const uploadings = ref([])
  
  const handleUpload = async (file) => {
    uploadings.value.push(file)
    file.status = 'uploading'
    const {Location: url} = await uploadFile(file.file, file.file.name)
    if (!url) return
    uploadings.value = uploadings.value.filter((item) => {
      if (item === file) return false
      return true
    })
    let newVal = props.modelValue
    if (newVal) newVal += ','
    newVal += `//${url}`
    emits('update:modelValue', newVal)
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


  
  return {
    afterRead,
    deleteHandle,
    fileList
  }
}