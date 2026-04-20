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
import { getFlexW } from '@/util'

const props = defineProps({
  listRef: {type: Object, default: () => {}}
})

const gap = getFlexW(24)

const _change = ref(false)
const localKey = 'goTopFloatPos'
const offsetDiaplay = computed({
  get() {
    if (_change.value) {}
    let x = getFlexW(375 - 24 - 30)
    let y = Math.floor(window.innerHeight / 2)
    let localData = localStorage.getItem(localKey)
    if (localData) {
      try {
        localData = JSON.parse(localData)
        x = localData.x
        y = localData.y
      } catch(e) {
        console.error(e)
      }
    }
    return {x, y}
  },
  set(val) {
    let {x, y} = val
    x = parseInt(x)
    y = parseInt(y)
    const localData = {x, y}
    localStorage.setItem(localKey, JSON.stringify(localData))
    _change.value = !_change.value
  }
})


const smoothScrollToTop = async (el, duration = 300) => {
  if (!el) return;

  const startPos = el.scrollTop;
  const startTime = performance.now();
  let timeElapsed = 0;

  // 使用 Promise 封装 requestAnimationFrame 作为一个等待器
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

  while (timeElapsed < duration) {
    const currentTime = await nextFrame(); // 等待浏览器准备好画下一帧
    timeElapsed = currentTime - startTime;
    
    const progress = Math.min(timeElapsed / duration, 1);
    
    // EaseOutCubic 缓动公式
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    
    // 执行滚动赋值
    el.scrollTop = startPos * (1 - easeOutCubic);
    
    // 如果已经滚到了 0，提前跳出循环提高性能
    if (el.scrollTop <= 0) break;
  }
  el.scrollTop = 0; // 最终保底归零
  scrollTop.value = 0;
};



const clickHandle = async () => {
  const {listRef} = props
  if (!listRef?.scrollTop) return
  smoothScrollToTop(listRef, 300)
}

const scrollTop = ref(0);
let lastScrollTime = 0;
const getScrollTopThrottled = () => {
  const now = Date.now();
  // 1000ms 节流一次
  if (now - lastScrollTime >= 1000) {
    if (props?.listRef) {
      scrollTop.value = props.listRef.scrollTop;
    }
    lastScrollTime = now;
  }
};


const isShow = computed(() => {
  if (!props.listRef) return false
  if (scrollTop.value >= 1000) return true
  return false
})

const change =  () => {
  getScrollTopThrottled()
}

defineExpose({change})


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
