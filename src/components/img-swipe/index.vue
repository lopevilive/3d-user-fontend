<template>
  <div class="com-img-swipe-wrap">
    <VanSwipe ref="swipeRef" class="com-img-swipe" :class="{mode2: mode === 2}" lazy-render>
      <VanSwipeItem v-for="(item, idx) in list" >
        <VanImage :fit="mode === 2 ? 'cover' : 'contain'" :src="getImageUrl(item)" @click="clickHandle(idx)"/>
      </VanSwipeItem>
    </VanSwipe>
    <div class="control-item control-left" @click="prevHandle" v-if="isShowControl">
      <VanIcon name="arrow-left"/>
    </div>
    <div class="control-item control-right" @click="nextHandle" v-if="isShowControl">
      <VanIcon name="arrow"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getImageUrl } from '@/util'
import { showImagePreview } from 'vant';
import { globalData } from '@/store'

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1} // 1 | 2
})

const swipeRef = ref()

const clickHandle = (idx) => {
  if (globalData.value.isPC) return
  showImagePreview(props.list, idx)
}

const prevHandle = () => {
  swipeRef.value.prev()
}

const nextHandle = () => {
  swipeRef.value.next()
}

const isShowControl = computed(() => {
  if (props.list?.length === 1) return false
  if (globalData.value.isPC) return true
  return false
})

</script>

<style lang="scss" scoped>
.com-img-swipe-wrap {
  position: relative;
  .control-item {
    position: absolute;
    top: 50%;
    background: rgba(0,0,0,.5);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    z-index: 10;
    color: #fff;
  }
  .control-left {
    left: 10px;
  }
  .control-right {
    right: 10px;
  }
}
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