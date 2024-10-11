<template>
  <VanUploader
    v-model="fileList"
    :after-read="afterRead"
    :multiple="true"
    @delete="deleteHandle"
  />
</template>

<script setup>
import { useUploadImages } from './hooks'

const props = defineProps({
  modelValue: {type: String, default: ''}
})
const emits = defineEmits(['update:modelValue'])

const {afterRead, deleteHandle, fileList} = useUploadImages(props, emits)

</script>