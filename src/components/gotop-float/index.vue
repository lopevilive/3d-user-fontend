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
import {ref, computed, onUnmounted} from 'vue'
import { getFlexW, emitter } from '@/util'
import { useRoute } from 'vue-router'


const route = useRoute()

const dataMap = {}

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

const clickHandle = async () => {
  const name = route.name
  const data = dataMap[name]
  if (!data) return
  const {listRef} = data
  if (!listRef?.value?.scrollTop) return
  listRef.value.scrollTo({top: 0, behavior: 'smooth'})
}

const key = ref(false)
const isShow = computed(() => {
  if(key.value) {}
  const name = route.name
  const data = dataMap[name]
  if (!data) return false
  if (data.listRef?.value?.scrollTop && data.listRef.value.scrollTop >= 1000) return true
  return false
})

const timer = setInterval(() => {
  key.value = !key.value
}, 2000);


emitter.on('registerGoTop', (data) => {
  const name = route.name
  dataMap[name] = data
  console.log(dataMap)
})

onUnmounted(() => {
  emitter.off('registerGoTop')
  clearInterval(timer)
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
