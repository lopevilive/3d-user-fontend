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
import { formatType } from '@/util'
import { globalData } from '@/store'
import { showToast } from 'vant'

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
  // const {type1, type2} = formatType(prodType.value)
  // if (type1) {
  //   for (const item of globalData.value.productTypes) {
  //     if (item.parentId === type1 && !type2) {
  //       showToast('请选择二级分类')
  //       return false
  //     }
  //   }
  // } 
  resolve(prodType.value)
  return true

}

const confirmHandle = () => {
  resolve(prodType.value)
}

const cancelHandle = () => {
  reject()
}

defineExpose({getType})

</script>