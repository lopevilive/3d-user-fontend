<template>
  <VanUploader v-model="fileList"/>
</template>

<script setup>
import { computed, ref } from 'vue'
import { uploadFile } from '@/http/cgi.js'
// todo 这里有bug，网络很慢的时候连续上传图片会出错，可以通过修改 currUploading 来解决

const props = defineProps({
  modelValue: {type: String, default: ''}
})
const emits = defineEmits(['update:modelValue'])

const currUploading = ref(null)

const handleUpload = async ( file ) => {
  file.status = 'uploading'
  const res = await uploadFile(file)
  currUploading.value = null
  file.status = ''
  const {path} = res.data
  let str = props.modelValue
  if (str) str += ','
  str += path
  emits('update:modelValue', str)
}

const fileList = computed({
  get() {
    let ret = null
    if (!props.modelValue) {
      ret = []
    } else {
      ret = props.modelValue.split(',').map((url) => {
      return {url}
    })
    }
    if (currUploading.value) ret.push(currUploading.value)
    return ret;
  },
  set(list) {
    if ( list.length > fileList.value.length) {
      // 新增
      const curr = list.pop()
      currUploading.value = curr
      handleUpload(curr)
      return
    }
    if (list.length < fileList.value.length) {
      // 删除
      const str = list.map((item) => item.url).join(',')
      emits('update:modelValue', str)
    }
  }
})


</script>