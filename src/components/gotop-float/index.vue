<template>
  <VanFloatingBubble
    class="share-float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offsetDiaplay"
    @click="clickHandle"
    v-if="isShow"
  >
    <div class="content">
      <VanIcon name="back-top"/>
    </div>
  </VanFloatingBubble>
</template>

<script setup>
import {ref, computed } from 'vue'
import {
  getFlexW, emitter, throttle,
  FLOAT_SIZE, getFloatOffset, saveFloatPos, bindScreenChange
} from '@/util'

const props = defineProps({
  listRef: {type: Object, default: () => {}}
})

const scrollTop = ref(0);
const dom = ref(null);

const gap = getFlexW(24)

const _change = ref(false)
const localKey = 'goTopFloatPos'

// 默认位置：右侧固定位置、垂直居中
const getDefaultOffset = () => ({
  x: getFlexW(375 - 24 - FLOAT_SIZE),
  y: Math.floor(window.innerHeight / 2)
})

const offsetDiaplay = computed({
  get() {
    if (_change.value) {}
    // 换屏（如折叠屏合上使用外屏）时会丢弃失效缓存并回到默认位置
    return getFloatOffset(localKey, getDefaultOffset(), gap)
  },
  set(val) {
    // 记录位置的同时记录当前屏幕尺寸，供下次进入/换屏时对比
    saveFloatPos(localKey, val)
    _change.value = !_change.value
  }
})

// 屏幕尺寸变化（折叠 / 旋转）时重新计算，必要时丢弃缓存
bindScreenChange(() => {
  _change.value = !_change.value
})


const clearHandle = () => {
  dom.value = null
  scrollTop.value =  0
}

const smoothScrollToTop = async (el, duration = 300) => {
  if (!el) return;
  el.scrollTo({top: 0, behavior: 'smooth'})
};



const clickHandle = async () => {
  if (!dom.value) return
  smoothScrollToTop(dom.value, 1000)
  clearHandle()
}


const isShow = computed(() => {
  if (!dom.value) return false
  if (scrollTop.value >= 1000) return true
  return false
})

const scrollChangeHandle = throttle((d, ) => {
  dom.value = d
  scrollTop.value = d.scrollTop
})

emitter.on('scrollChange', scrollChangeHandle)
emitter.on('scrollClearHandle', clearHandle)



</script>

<style lang="scss">
.share-float {
  width: 30px;
  height: 30px;
  opacity: .8;
  .van-icon {
    font-size: 18px;
  }
}
</style>
