<template>
  <div class="com-cell-label">
    <div class="text-wrap">
      <slot>
        {{ txt }}
      </slot>
    </div>
    <div v-if="url.length" class="btn-view-demo" @click="viewHandle">查看示例</div>
  </div>
  <VanDialog
    confirm-button-text="关闭"
    v-model:show="isShowDialog"
    class="com-cell-label_dialog"
  >
    <div class="com-cell-label_content">
      <ImgSwipeV2 :list="props.url" :mode="1"/>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'

const props = defineProps({
  txt: {type: String, default: ''},
  url: {type: Array, default: () => []}
})

const isShowDialog = ref(false)

const viewHandle = async () => {
  isShowDialog.value = true
}

</script>

<style lang="scss" scoped>
.com-cell-label {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
  .btn-view-demo {
    color: $btnText;
    padding: 0  10px;
    flex-shrink: 0;
  }
}

</style>

<style lang="scss">
.com-cell-label_dialog {
  width: 350px;
  border-radius: 0;
  .com-cell-label_content {
    padding: 10px 0px;
    box-sizing: border-box;
  }

}
</style>