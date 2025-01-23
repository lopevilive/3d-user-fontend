<template>
  <VanFloatingBubble
    class="share-float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offset"
    @click="clickHandle"
    v-if="isShow"
  >
    <div class="content">
      <VanIcon name="back-top"/>
    </div>
  </VanFloatingBubble>
</template>

<script setup>
import {ref, computed} from 'vue'
import { sleep, getFlexW } from '@/util'

const props = defineProps({
  listRef: {type: Object},
  scrollT: {type: Number}
})

const gap = getFlexW(24)
const offset = ref({ x: getFlexW(375 - 24 - 30), y: window.innerHeight * 0.5});

const clickHandle = async () => {
  let remain = props.scrollT || 0
  let unit =Math.floor( props.scrollT / 10)
  while(remain > 0) {
    remain -= unit
    if (remain <= 0) remain = 0
    await sleep(20)
    props.listRef.scrollTop = remain
  }
}

const isShow = computed(() => {
  if (props.scrollT >= 1000) return true
  return false
})


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
