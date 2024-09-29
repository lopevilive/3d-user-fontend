<template>
  <VanDialog
    class="com-model-display"
    v-model:show="isShow"
    :showConfirmButton="false"
    :closeOnClickOverlay="true"
    @closed="destoryModel"
  >
    <div class="content" id="scene" v-if="isShow">
      <iframe class="iframe-wrap" src="https://vr.justeasy.cn/view/1t68i47165dr73p1-1684715734.html"> </iframe>
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
    // nextTick(initModel)
  }
})


</script>

<style lang="scss">
.com-model-display {
  width: 94vw;
  height: 75vh;
  top: 50% !important;
  overflow: hidden;
  max-width: none !important;
  border-radius: $bdrM !important;
  box-shadow: $shadowBlack;
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
      top: 0;
      right: 0;
      padding: 5px;
      font-size: 16px;
      .van-icon {
        background: #dde6eb;
        border-radius: 50%;
        padding: 4px
      }
    }
  }
}


</style>
