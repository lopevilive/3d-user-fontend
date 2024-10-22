<template>
  <VanSwipe class="com-img-swipe">
    <VanSwipeItem v-for="(item, idx) in list">
      <VanImage fit="contain" :src="getImageUrl(item)" @click="clickHandle(idx)"/>
    </VanSwipeItem>
  </VanSwipe>
</template>

<script setup>
import { computed } from 'vue'
import { getImageUrl } from '@/util'
import { showImagePreview } from 'vant';

const props = defineProps({
  list: {type: Array, default: () => []}
})

const previewList = computed(() => {
  return props.list.map((item) => getImageUrl(item, 100))
})

const clickHandle = (idx) => {
  showImagePreview(previewList.value, idx)
}

</script>

<style lang="scss" scoped>
.com-img-swipe {
  width: 375px;
  height: 375px;
  :deep(.van-image) {
    width: 100%;
    height: 100%;
  }
  :deep(.van-swipe__indicator) {
    opacity: 1;
  }
}

</style>