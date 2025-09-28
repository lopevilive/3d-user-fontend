<template>
  <VanDialog
    v-model:show="show" class="com-input-dialog"
    :title="title" show-cancel-button :beforeClose="beforeClose"
    :z-index="3000"
    teleport="body"
  >
    <div class="dialog-content">
      <VanField :placeholder="placeholder" v-model="modelValue" input-align="center" :maxlength="maxlength" />
    </div>
  </VanDialog>
</template>

<script setup>
import {ref} from 'vue'
import { showToast } from 'vant';

const show = ref(false)
const title = ref('')
const modelValue = ref('')
const maxlength = ref(12)
const nullAble = ref(false)
const placeholder = ref('')
let resolve = null
let reject = null
let validFn = null

const getVal = async (rawVal, cfg) => {
  modelValue.value = rawVal || ''
  title.value = cfg.title || ''
  placeholder.value = cfg.placeholder || '请输入'
  maxlength.value = cfg.maxlength || 12
  validFn = cfg.validFn || null // 校验函数
  nullAble.value = cfg.nullAble || false // 能否为空

  show.value = true
  const p = new Promise((r, s) => {
    resolve = r
    reject = s
  })
  return p
}

const beforeClose = async (action) => {
  if (action === 'cancel') {
    reject()
    return true
  }
  const val = modelValue.value.trim()
  if (!val && nullAble.value === false) {
    showToast('请输入')
    return false
  }
  if (validFn) {
    const errMsg = await validFn(val)
    if (errMsg) {
      showToast(errMsg)
      return false
    }
  }
  resolve(modelValue.value)
  return true
}

defineExpose({getVal})

</script>

<style lang="scss">
.com-input-dialog {
  .dialog-content {

  }
}
</style>