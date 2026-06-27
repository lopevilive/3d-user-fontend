<template>
  <VanDialog
    confirm-button-text="关闭"
    v-model:show="isShowDialog"
    class="com-dialog-imgs"
  >
    <div class="com-dialog-imgs__content">
      <ImgSwipeV2 :list="urlList" :mode="1"/>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'

const urlList = ref([])
const isShowDialog = ref(false)

const show = async (list) => {
  urlList.value = list || []
  if (!urlList.value.length) return
  isShowDialog.value = true
}

defineExpose({show})


</script>

<style lang="scss">
.com-dialog-imgs {
  width: 350px;
  border-radius: 0;
}
.com-dialog-imgs__content {
  padding: 10px 0px;
  box-sizing: border-box;
}

</style>