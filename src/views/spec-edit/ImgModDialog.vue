<template>
  <VanDialog
    class="view-com-img-mod-dialog"
    v-model:show="isShow"
    cancelButtonText="取消"
    confirmButtonText="保存"
    show-cancel-button
    :beforeClose="beforeClose"
  >
    <div class="view-com-img-mod-dialog__content">
      <div class="tit">{{ name }}</div>
      <div class="img-list">
        <div class="item" v-for="(item, itemIdx) in subList">
          <div class="name ellipsis">{{ item.name }}</div>
          <div class="img-wrap">
            <UploadImgs v-model="item.url" :maxCount="1" :ref="(el) => {
              uploadImgsRef[itemIdx] = el
            }" />
          </div>
        </div>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import {ref} from 'vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { showToast } from 'vant';

const isShow = ref(false)

let resolve
let reject

const name = ref('')
const subList = ref([])
const uploadImgsRef = ref([])

const beforeClose = async (action) => {
  if (action === 'cancel') {
    reject(null)
    return true
  }
  for (const imgRef of uploadImgsRef.value){
    if (!imgRef) continue
    if (imgRef?.isLoading)  {
      showToast('请等待图片上传完成再保存～')
      return false
    }
  }
  resolve(subList.value)
  return true

}

const getImgs = async (payload) => {
  name.value = payload.name
  subList.value = JSON.parse(JSON.stringify(payload.list))

  isShow.value =  true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

defineExpose({getImgs})

</script>

<style lang="scss" scoped>
.view-com-img-mod-dialog {
  .tit {
    font-weight: bold;
    box-sizing: border-box;
    padding: $pdH $pdH $pdL $pdH;
    border-bottom: 1px solid $bgGrey;
    margin-bottom: 5px;
    text-align: center;
  }
  .img-list {
    height: 400px;
    overflow: auto;
    padding: 0 $pdH;
    box-sizing: border-box;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $bgGrey;
      margin-bottom: 10px;
      .name  {
        flex: 1;
        margin-right: 10px;

      }
      .img-wrap {
        width: 70px;
      }
    }
  }
}

</style>