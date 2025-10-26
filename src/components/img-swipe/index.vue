<template>
  <div class="com-img-swipe-wrap">
    <VanSwipe
      ref="swipeRef" :style="styleDisplay" class="com-img-swipe"
      :class="{mode2: mode === 2, mode1: mode === 1}" lazy-render
      :autoplay="autoplay"
    >
      <VanSwipeItem v-for="(item, idx) in list" >
        <VanImage :fit="mode === 2 ? 'cover' : 'contain'" :src="getImageUrl(item)" @click="clickHandle(idx)" lazy-load/>
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
import { getImageUrl, getFlexW, isVip, shopInfoManage } from '@/util'
import { showImagePreview } from 'vant';
import { globalData } from '@/store'
import { useRoute } from 'vue-router'

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1}, // 1 | 2
  scale: {type: String, default: '0.5'},
  autoplay: {type: Number, default: 0},
  width: {type: Number, default: 375},
})

const route = useRoute()

const shopId = + route.params.shopId

const swipeRef = ref()
const shopInfo = ref()

const displayPreviewList = computed(() => {
  let ret = []
  for (const item of props.list) {
    // if (shopInfo.value && isVip(shopInfo.value)) {
    //   ret.push(getImageUrl(item, 95))
    //   continue
    // }
    ret.push(getImageUrl(item))
  }
  return ret
})

const clickHandle = (idx) => {
  if (globalData.value.isPC) return
  showImagePreview(displayPreviewList.value, idx)
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

const styleDisplay = computed(() => {
  let ret = '';
  if (props.mode === 2) {
    const h = getFlexW(props.width * Number(props.scale))
    ret += `height: ${h}px;`
  }
  const w = getFlexW(props.width)
  ret += `width: ${w}px;`
  return ret
})

const init = async () => {
  if (shopId) {
    const info = await shopInfoManage.getData(shopId)
    shopInfo.value = info[0]
  }
}

init()

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
  // width: 275px;
  &.mode1 {
    min-height: 200px;
  }
  &.mode2 {
    :deep(.van-image) {
      height: 100%;
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