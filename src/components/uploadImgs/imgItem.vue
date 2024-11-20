<template>
  <div class="com-img-item">
    <VanImage :src="url" @click="imgClick"/>
    <div class="close" v-if="!isLoading" @click="clickHandle">
      <VanIcon name="cross" />
    </div>
    <div class="mask" v-if="isLoading">
      <VanLoading />
    </div>
    <div class="mask fail" v-if="isFaild">
      <div>上传失败~</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getImageUrl } from '@/util'

const props = defineProps({
  data: {type: Object}
})
const emits = defineEmits(['delete', 'view'])

const url = computed(() => {
  const {url, objectUrl} = props.data
  if (url) return getImageUrl(url)
  return objectUrl
})

const isLoading = computed(() => {
  const {status} = props.data
  if (!status) return false
  if (status === 'uploading') return true
  return false
})

const isFaild = computed(() => {
  if (props.data?.status === 'fail') return true
  return false
})

const clickHandle = () => {
  emits('delete', props.data)
}

const imgClick = () => {
  emits('view')
}


</script>

<style lang="scss" scoped>
$imgW: 60px;
.com-img-item {
  margin-right: 5px;
  position: relative;
  .close {
    position: absolute;
    top: 1px;
    right: 1px;
    width: 16px;
    height: 16px;
    color: #fff;
    background: black;
    border-radius: 50%;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .mask {
    width: $imgW;
    height: $imgW;
    background: rgba(0,0,0,.7);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .fail {
    font-size: 10px;
    color: $fontWhite;
  }
}
.van-image {
  width: $imgW;
  height: $imgW;
}

</style>