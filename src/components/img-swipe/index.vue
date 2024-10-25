<template>
  <VanSwipe class="com-img-swipe" :class="{mode2: mode === 2}">
    <VanSwipeItem v-for="(item, idx) in list" >
      <VanImage :fit="mode === 2 ? 'cover' : 'contain'" :src="getImageUrl(item)" @click="clickHandle(idx)"/>
    </VanSwipeItem>
  </VanSwipe>
</template>

<script setup>
import { getImageUrl } from '@/util'
import { showImagePreview } from 'vant';

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1} // 1 | 2
})

const clickHandle = (idx) => {
  showImagePreview(props.list, idx)
}

</script>

<style lang="scss" scoped>
.com-img-swipe {
  width: 375px;
  height: 375px;
  &.mode2 {
    height: 200px;
  }
  :deep(.van-image) {
    width: 100%;
    height: 100%;
  }
  :deep(.van-swipe__indicator) {
    opacity: 1;
  }
}

</style>