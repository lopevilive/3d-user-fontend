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
  min-height: 200px;
  &.mode2 {
    height: 200px;
    :deep(.van-image) {
      height: 200px;
    }
  }
  :deep(.van-swipe__track) {
    // background: #000;
  }
  :deep(.van-swipe-item) {
    margin: auto 0;
    .van-image__img {
      max-height: 480px;
    }
  }
  :deep(.van-image) {
    width: 100%;
  }
  :deep(.van-swipe__indicator) {
    opacity: 1;
  }
}

</style>