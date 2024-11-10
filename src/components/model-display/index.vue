<template>
  <VanDialog
    class="com-model-display"
    v-model:show="isShow"
    :showConfirmButton="false"
    :closeOnClickOverlay="true"
    @closed="destoryModel"
  >
    <div class="content" id="scene" v-if="isShow">
      <template v-if="productInfo.type3D === 2">
        <iframe class="iframe-wrap" :src="productInfo.modelUrl"> </iframe>
      </template>
      <VanLoading v-if="isShowLoading" />
      <div class="close">
        <VanIcon name="cross" @click="handleClose"/>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { defineExpose, nextTick} from 'vue'
import {useModelDisplay} from './hooks'

const props = defineProps({
  productInfo: {type: Object}
})

const emits = defineEmits(['update:show'])
const domId = '#scene'

const {
  isShow,
  initModel,
  isShowLoading,
  handleClose,
  destoryModel
} = useModelDisplay(props, emits, domId)

defineExpose({
  showModelDisplay: () => {
    isShow.value = true
    nextTick(initModel)
  }
})


</script>

<style lang="scss">
.com-model-display {
  width: 94vw;
  height: 80vh;
  overflow: hidden;
  max-width: none !important;
  border-radius: $bdrM !important;
  box-shadow: $shadowBlack;
  top: 45% !important;
  overflow: visible;
  .van-dialog__content {
    height: 100%;
    width: 100%;
  }
  #scene {
    height: 100%;
    width: 100%;
    background: $bgGrey;
    position: relative;
    .iframe-wrap {
      width: 100%;
      height:  100%;
    }
    .van-loading {
      position: absolute;
      top: 50%;
      left: 50%
    }
    .close {
      position: absolute;
      bottom: -60px;
      right: 50%;
      transform: translateX(50%);
      padding: 5px;
      font-size: 24px;
      .van-icon {
        background: rgba(0,0,0,.3);
        color: #bebcbb;
        border: 1px solid #bebcbb;
        border-radius: 50%;
        padding: 4px;
      }
    }
  }
}


</style>
