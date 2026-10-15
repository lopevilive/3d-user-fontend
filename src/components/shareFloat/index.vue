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
import {
  toSharePage, shopInfoManage, getImageUrl, getFlexW, getRidByShopId,
  FLOAT_SIZE, getFloatOffset, saveFloatPos, bindScreenChange
} from '@/util'
import { useRoute } from 'vue-router'
import { globalData } from '@/store'

const route = useRoute()

const gap = getFlexW(24)

const _change = ref(false)
const localKey = 'shareFloatPos'

// 垂直方向的错开系数（多个悬浮球之间避免重叠）
const num = 1

// 默认位置：右侧固定位置、垂直方向按系数错开
const getDefaultOffset = () => ({
  x: getFlexW(375 - 24 - FLOAT_SIZE),
  y: Math.floor(window.innerHeight / 2 + getFlexW(20 * num) + getFlexW(FLOAT_SIZE) * num)
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

const shopInfo = ref({})

const clickHandle = async () => {
  await init()
  const shopId = +route.params.shopId
  const {name, url, desc, forwardPermi, openInH5} = shopInfo.value
  const sharePayload = {
    src_path: `/product-manage/${shopId}?title=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(getImageUrl(url.split(',')[0]))}`,
    url: getImageUrl(url?.split(',')?.[0] || ''),
    title: name,
    desc1: [desc || ''],
    desc2: [],
    scene: {name: 'product-manage', shopId},
    forwardPermi,
  }
  const currShopRid = getRidByShopId(shopId, globalData.value.userInfo)
  if (openInH5 === 1 && [2,3,4,99].includes(currShopRid)) {
    sharePayload.h5Url = `${location.origin}/dist/product-manage/${shopId}`
  }
  toSharePage(sharePayload)
}

const isShow = computed(() => {
  if (!['custom-home', 'product-manage'].includes(route.name)) return false
  if (!globalData.value.userInfo?.userId) return false
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
