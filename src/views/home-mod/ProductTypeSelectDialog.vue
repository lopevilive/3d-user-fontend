<template>
  <VanDialog title="新增一项" v-model:show="isShow" show-cancel-button :beforeClose="beforeClose">
    <div class="view-com-product-type-select-dialog">
      <ProdTypeSelect v-model="typeId" :mode="2">
        <template #label>
          分类名称
        </template>
      </ProdTypeSelect>
      <VanField label="分类 logo" :border="false">
        <template #input>
          <UploadImgs v-model="url" ref="uploadImgsRef" :noWatermark="1" />
        </template>
      </VanField>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import ProdTypeSelect from '@/components/prod-type-select/index.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { showToast } from 'vant';

const isShow = ref(false)
let resolve = null
let reject = null

const typeId = ref('')
const url = ref('')
const uploadImgsRef = ref()

const beforeClose = async (action) => {
  if (action === 'cancel') {
    reject(null)
    return true
  }
  if (!typeId.value) {
    showToast('请选择分类')
    return false
  }
  if (uploadImgsRef?.value?.isLoading) {
    showToast('请等待图片上传')
    return false
  }
  // if (!url.value) {
  //   showToast('请上传 logo')
  //   return false
  // }
  resolve({ url: url.value, typeId: typeId.value })
  return true
}


const show = async () => {
  typeId.value = ''
  url.value = ''
  isShow.value = true
  const p = new Promise((a,b) => {
    resolve = a
    reject = b
  })
  return p
}


defineExpose({show})




</script>

<style lang="scss" scoped>
.view-com-product-type-select-dialog {

}

</style>