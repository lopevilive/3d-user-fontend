<template>
  <VanDialog title="批量分类" v-model:show="show" show-cancel-button @confirm="confirmHandle" @cancel="cancelHandle">
    <ProdTypeSelect v-model="prodType"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import ProdTypeSelect from '/Users/crushcaca/Desktop/pro/user-font-end/src/components/prod-type-select/index.vue'

const prodType = ref('')
const show = ref(false)

let resolve
let reject
const getType = async () => {
  show.value = true
  prodType.value = ''
  return new Promise((a, b) => {
    resolve = a
    reject = b
  })
}

const confirmHandle = () => {
  resolve(prodType.value)
}

const cancelHandle = () => {
  reject()
}

defineExpose({getType})

</script>