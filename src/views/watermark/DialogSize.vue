<template>
  <VanDialog :title="title" v-model:show="isShow" show-cancel-button :beforeClose="beforeClose">
    <div class="view-com-dialog-size">
      <div class="count">{{ fontsize }}</div>
      <div class="sider-wrap">
        <VanSlider v-model="fontsize" :min="min" :max="max" :step="step" />
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(false)
const fontsize = ref()
let resolve = null
let reject = null

const title = ref('')
const min = ref()
const max = ref()
const step = ref()

const beforeClose = (action) => {
  if (action === 'cancel') {
    reject()
    return true
  }
  resolve(fontsize.value)
  return true
}

const show = ({val, title: a, min: b, max: c, step: d}) => {
  fontsize.value = val
  title.value= a
  min.value = b
  max.value = c
  step.value = d
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
.view-com-dialog-size {
  padding-bottom: 40px;
  .count {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
  .sider-wrap {
    padding: 0 20px;
    margin-top: 20px;
  }
}


</style>
