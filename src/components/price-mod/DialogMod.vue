<template>
  <VanDialog
    :title="title"
    v-model:show="show"
    :beforeClose="beforeClose"
    show-cancel-button
  >
    <VanField v-model="val" placeholder="请输入" input-align="center" :maxlength="maxlength" />
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'

const val = ref('')
const show = ref(false)
const title = ref('')
const maxlength = ref(8)

let resolve
let reject

const getVal = async (payload) => {
  title.value = payload.title
  val.value = payload.val || ''
  maxlength.value = payload.maxlength || 8
  show.value = true
  return new Promise((a, b) => {
    resolve = a
    reject = b
  })
}

const beforeClose = (action) => {
  if (action === 'cancel') {
    reject()
    return true
  }
  resolve(val.value)
  return true
}

defineExpose({getVal})



</script>
