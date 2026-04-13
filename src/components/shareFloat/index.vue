<template>
  <VanFloatingBubble
    class="com-share-float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offsetDiaplay"
    @click="clickHandle"
    v-if="isShow"
  >
    <div class="content">
      <VanIcon name="share"/>
    </div>
  </VanFloatingBubble>
</template>

<script setup>
import {ref, computed} from 'vue'
import { toSharePage,  shopInfoManage, getImageUrl, getFlexW} from '@/util'
import { useRoute } from 'vue-router'
import { globalData } from '@/store'

const route = useRoute()

const gap = getFlexW(24)

const _change = ref(false)
const localKey = 'shareFloatPos'
const offsetDiaplay = computed({
  get() {
    if (_change.value) {}
    const num = 1;
    let y = Math.floor(window.innerHeight / 2 + getFlexW(20 * num) + getFlexW(30) * num)
    let x = getFlexW(375 - 24 - 30)
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

const shopInfo = ref({})

const clickHandle = async () => {
  const shopId = +route.params.shopId
  const {name, url, desc, forwardPermi} = shopInfo.value
  toSharePage({
    src_path: `/product-manage/${shopId}?title=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(getImageUrl(url.split(',')[0]))}`,
    url: url?.split(',')?.[0] || '',
    title: name,
    desc1: [desc || ''],
    desc2: [],
    scene: {name: 'product-manage', shopId},
    forwardPermi
  })
}

const isShow = computed(() => {
  if (!['custom-home', 'product-manage', 'contact'].includes(route.name)) return false
  const {rid, editStatus} = globalData.value
  if (editStatus === 1) return false
  if ([2,3,4,99].includes(rid)) return true
  if (shopInfo.value.forwardPermi === 1) return false
  return true
})

const init = async () => {
  const shopId = +route.params.shopId
  const tmp = await shopInfoManage.getData(shopId)
  shopInfo.value = tmp[0]
}

init()

</script>

<style lang="scss">
.com-share-float {
  width: 30px;
  height: 30px;
  opacity: .8;
}
</style>
