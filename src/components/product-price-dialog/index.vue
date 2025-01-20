<template>
  <VanDialog
    :title="title"
    v-model:show="show"
    show-cancel-button
    :beforeClose="beforeClose"
  >
    <VanField required label="价格" :maxlength="10" v-model="price" placeholder="请输入价格"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { priceReg } from '@/util'
import { showToast } from 'vant';

const props = defineProps({
  title: {type: String, default: '产品价格'}
})

const price = ref('')
const show = ref(false)

let resolve
let reject
const getPrice = async () => {
  show.value = true
  price.value = ''
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
  let str = price.value || ''
  str = str.trim()
  if (!str) {
    resolve(str)
    return true
  }
  if (!priceReg.test(str)) {
    showToast('请输入正确价格')
    return false
  }
  resolve(str)
  return true
}

defineExpose({getPrice})

</script>