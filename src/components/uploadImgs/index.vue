<template>
  <div class="com-upload-imgs">
    <div class="wrap">
      <Container v-if="uploadings.length === 0" @drop="onDrop" orientation="horizontal" lock-axis="x">
        <Draggable v-for="(item, idx) in fileList">
          <ImgItem :data="item" @delete="deleteHandle" @view="viewHandle(idx)"/>
        </Draggable>
      </Container>
      <ImgItem v-else v-for="item in fileList" :data="item" @delete="deleteUploading" />
      <VanUploader
        ref="vanUploaderRef"
        :after-read="afterRead"
        :multiple="true"
        preview-size="16vw"
        :max-count="maxC"
        :max-size="1024 * 1024 * maxSize"
        @oversize="oversizeHandle"
        v-if="isShowUpload"
      />
    </div>
  </div>
  <OverDialog ref='overDialogRef' />
</template>

<script setup>
import { useUploadImages } from './hooks'
import ImgItem from './imgItem.vue'
import OverDialog from './OverDialog.vue'
import { Container, Draggable } from "vue3-smooth-dnd";

const props = defineProps({
  modelValue: {type: String, default: ''},
  maxCount: {type: Number, default: 1},
  maxSize: {type: Number, default: 10},
  noWatermark: {type: Number, default: 0},
  noJPG: {type: Number, default: 0}
})
const emits = defineEmits(['update:modelValue', 'start'])

const {
  afterRead,
  deleteHandle,
  fileList,
  onDrop,
  uploadings,
  isShowUpload,
  oversizeHandle,
  viewHandle,
  deleteUploading,
  isLoading,
  maxC,
  vanUploaderRef,
  chooseFile,
  overDialogRef
} = useUploadImages(props, emits)

defineExpose({isLoading, chooseFile})

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

<style lang="scss">
.smooth-dnd-disable-touch-action * {
  touch-action: auto !important;
}

</style>