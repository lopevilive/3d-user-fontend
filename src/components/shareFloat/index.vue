<template>
  <VanFloatingBubble
    class="com-share-float"
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
let num = 1
const y = Math.floor(window.innerHeight / 2 + getFlexW(20 * num) + getFlexW(30) * num)
const offset = ref({ x: getFlexW(375 - 24 - 30), y});

const shopInfo = ref({})

const clickHandle = async () => {
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
  const {rid} = globalData.value
  if ([2,3,99].includes(rid)) return true
  if (shopInfo.value.forwardPermi === 1) return false
  return true
})

const init = async () => {
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
