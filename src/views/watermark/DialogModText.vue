<template>
  <VanDialog title="水印内容" v-model:show="isShow" show-cancel-button :beforeClose="beforeClose">
    <VanField placeholder="请输入" input-align="center" v-model="text" :maxlength="20" show-word-limit/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { emojiReg } from '@/util'

const isShow = ref(false)
const text = ref('')
let resolve = null
let reject = null

const beforeClose = (action) => {
  if (action === 'cancel') {
    reject()
    return true
  }
  text.value = text.value.trim()
  text.value = text.value.replaceAll(emojiReg, '')
  if (!text.value) {
    showFailToast('请输入内容~')
    return false
  }
  resolve(text.value)
  return true
}

const show = (str) => {
  text.value = str
  isShow.value = true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

defineExpose({show})

</script>