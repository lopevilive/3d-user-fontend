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

const shopId = +route.params.shopId

const gap = getFlexW(24)
const offset = ref({ x: getFlexW(375 - 24 - 30), y: window.innerHeight * 0.7});

const clickHandle = async () => {
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0]
  toSharePage({
    src_path: `/product-manage/${shopId}?title=${encodeURIComponent(shopInfo.name)}&imageUrl=${encodeURIComponent(getImageUrl(shopInfo.url.split(',')[0]))}`,
    url: shopInfo.url?.split(',')?.[0] || '',
    title: shopInfo.name,
    desc1: [shopInfo.desc || ''],
    desc2: [],
    scene: {name: 'product-manage', shopId}
  })
}

const isShow = computed(() => {
  if ([0,1,10].includes(globalData.value.rid)) return true
  return false
})

</script>

<style lang="scss">
.share-float {
  width: 30px;
  height: 30px;
  opacity: .8;
}
</style>
