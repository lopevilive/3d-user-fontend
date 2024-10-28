<template>
  <VanDialog title="批量改价" v-model:show="show" show-cancel-button @confirm="confirmHandle" @cancel="cancelHandle">
    <VanField required label="价格" v-model="price" placeholder="请输入价格"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'

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

const confirmHandle = () => {
  resolve(price.value)
}

const cancelHandle = () => {
  reject()
}

defineExpose({getPrice})

</script>