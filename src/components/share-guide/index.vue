<template>
  <VanOverlay class="com-share-guide" :show="show" @click="show = false">
    <div class="content" @click="show = false">
      <div class="tips">
        <div>请点击右上角</div>
        <VanIcon name="weapp-nav" />
        <div>进行分享</div>
        </div>
      <div class="btn">
        <div class="txt">知道了</div>
      </div>
    </div>
  </VanOverlay>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)

const showGuide = () => {
  show.value = true
}

defineExpose({showGuide})


</script>

<style lang="scss" scoped>
.com-share-guide {
  .content {
    .tips {
      display: flex;
      align-items: center;
      justify-content: center;
      color: $fontWhite;
      font-size: 24px;
      padding-top: 100px;
      :deep(.van-icon) {
        color: #000;
        background-color: #fff;
        margin: 0 10px;
        padding: 5px 10px;
        border-radius: $bdrH;
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      padding: 0 30px;
      margin-top: 50px;
      .txt {
        color: $fontWhite;
        font-size: 24px;
        border: 1px solid $fontWhite;
        width: 100%;
        text-align: center;
        line-height: 50px;
        border-radius: 30px;
      }
    }
  }
}


</style>