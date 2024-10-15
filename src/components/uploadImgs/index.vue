<template>
  <div class="com-upload-imgs">
    <div class="wrap">
      <Container v-if="uploadings.length === 0" @drop="onDrop" orientation="horizontal" lock-axis="x">
        <Draggable v-for="item in fileList">
          <ImgItem :data="item" @delete="deleteHandle"/>
        </Draggable>
      </Container>
      <ImgItem v-else v-for="item in fileList" :data="item" />
      <VanUploader
        :after-read="afterRead"
        :multiple="true"
        preview-size="16vw"
      />
    </div>
  </div>
</template>

<script setup>
import { useUploadImages } from './hooks'
import ImgItem from './imgItem.vue'
import { Container, Draggable } from "vue3-smooth-dnd";

const props = defineProps({
  modelValue: {type: String, default: ''},
})
const emits = defineEmits(['update:modelValue'])

const {afterRead, deleteHandle, fileList, onDrop, uploadings} = useUploadImages(props, emits)

</script>

<style scoped lang="scss">
.com-upload-imgs {
  width: 100%;
  height: 70px;
  position: relative;
  :deep(.smooth-dnd-container) {
    min-width: 0;
  }
  .wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
  }
}

</style>