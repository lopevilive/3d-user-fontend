<template>
  <div class="com-img-item">
    <VanImage :src="getImageUrl(url)" />
    <div class="close" v-if="!isLoading" @click="clickHandle">
      <VanIcon name="cross" />
    </div>
    <div class="mask" v-if="isLoading">
      <VanLoading />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Image as VanImage } from 'vant';
import { getImageUrl } from '@/util'

const props = defineProps({
  data: {type: Object}
})
const emits = defineEmits(['delete'])

const url = computed(() => {
  const {url, objectUrl} = props.data
  return url || objectUrl
})

const isLoading = computed(() => {
  const {status} = props.data
  if (!status) return false
  if (status === 'uploading') return true
  return false
})

const clickHandle = () => {
  emits('delete', props.data)
}


</script>

<style lang="scss" scoped>
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
  }
  .mask {
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.7;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
}
.van-image {
  width: 60px;
  height: 60px;
}

</style>