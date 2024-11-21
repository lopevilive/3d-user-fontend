<template>
  <VanDialog
    title="批量改价"
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

const confirmHandle = () => {
  resolve(price.value)
}

const cancelHandle = () => {
  reject()
}

defineExpose({getPrice})

</script>