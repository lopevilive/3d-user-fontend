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
import { getFlexW, emitter, throttle } from '@/util'

const props = defineProps({
  listRef: {type: Object, default: () => {}}
})

const scrollTop = ref(0);
const dom = ref(null);

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


const clearHandle = () => {
  dom.value = null
  scrollTop.value =  0
}

const smoothScrollToTop = async (el, duration = 300) => {
  if (!el) return;
  el.scrollTo({top: 0, behavior: 'smooth'})
  return

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
