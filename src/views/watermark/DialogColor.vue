<template>
  <VanDialog title="水印颜色" v-model:show="isShow" show-cancel-button :beforeClose="beforeClose">
    <div class="view-com-dialog-color__content">
      <ColorPicker v-model:pureColor="pureColor" :isWidget="true" :disableHistory="true" format="hex6" />
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { ColorPicker } from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

const isShow = ref(false)
let resolve = null
let reject = null

const pureColor = ref('')

const beforeClose = (action) => {
  if (action === 'cancel') {
    reject()
    return true
  }
  resolve(pureColor.value)
  return true
}

const show = (val) => {
  pureColor.value = val
  isShow.value = true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

defineExpose({show})

</script>

<style lang="scss" scoped>
.view-com-dialog-color__content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  :deep(.vc-colorpicker) {
    box-shadow: none;
  }
  :deep(.vc-input-toggle) {
    display: none;
  }
  :deep(.vc-alpha-input) {
    display: none;
  }
  :deep(.vc-alpha-slider) {
    display: none;
  }
}

</style>