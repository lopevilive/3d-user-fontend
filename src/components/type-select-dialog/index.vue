<template>
  <VanDialog
    :title="dialogTit" v-model:show="show" show-cancel-button
    :beforeClose="beforeClose"
  >
    <ProdTypeSelect v-model="prodType"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import ProdTypeSelect from '@/components/prod-type-select/index.vue'

const prodType = ref('')
const show = ref(false)

const dialogTit = ref('批量分类')

let resolve
let reject
const getType = async (val, title = '批量分类') => {
  dialogTit.value = title
  show.value = true
  prodType.value = val || ''
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
  resolve(prodType.value)
  return true

}

defineExpose({getType})

</script>