<template>
  <div class="com-qrcode-scanner" :class="{'theme-black': status === 2}" v-if="status > 0">
    <div class="overlay" v-if="status === 1"><VanLoading /></div>
    <div class="wrap">
      <div id="scanner-reader"></div>
      <div v-if="status === 2" class="back" @click="close"><VanIcon name="arrow-left" /></div>
      <!-- <div v-if="status === 2" class="upload-qrcode">
        <VanUploader>
          <div class="uploader">
            <div class="icon-content">
              <VanIcon name="photo" />
            </div>
            <div class="txt">相册</div>
          </div>
        </VanUploader>
      </div> -->
    </div>
  </div>
  <VanActionSheet
    :actions="actions"
    v-model:show="isShowAction"
    cancel-text="取消"
    teleport="body"
    @select="actionHandle"
  />
  <VanUploader ref="uploaderRef" :after-read="afterRead">
    <div style="width: 0px;height: 0px;"></div>
  </VanUploader>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useQrcodeScanner } from './hook';

const emits = defineEmits(['scan'])

const {
  status,
  close,
  actions,
  isShowAction,
  actionHandle,
  show,
  uploaderRef,
  afterRead
} = useQrcodeScanner(emits)

defineExpose({
  show
})

onBeforeUnmount(close)

</script>

<style scoped lang="scss">
.com-qrcode-scanner {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  .overlay {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0e0c0d;
    opacity: .5;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
  }
  .wrap {
    width: 100%;
    margin-top: 20vh;
    position: relative;
    .back {
      position: absolute;
      left: 10px;
      top: 15px;
      background: #ffffff;
      color: #777167;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
    }
    .upload-qrcode {
      position: absolute;
      right: 10px;
      bottom: 10px;
      // :deep(.uploader) {
      //   display: flex;
      //   flex-direction: column;
      //   align-items: center;
      //   color: $fontWhite;
      //   .icon-content {
      //     width: 46px;
      //     height: 46px;
      //     display: flex;
      //     justify-content: center;
      //     align-items: center;
      //     font-size: 20px;
      //     background: #84807b;
      //     border-radius: 50%;
      //   }
      //   .txt {
      //     font-size: 12px;
      //     margin-top: 3px;
      //   }
      // }
    }
  }
  #scanner-reader {
    width: 100%;
  }
}
.theme-black {
  background: #0e0c0d;
}

</style>

