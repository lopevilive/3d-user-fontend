
<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="aliveList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <FooterBar />
</template>

<script setup>
import FooterBar from '@/components/footer-bar/index.vue'
import { computed } from 'vue'
import { globalData } from '@/store'

const aliveList = computed(() => {
  const ret = ['ProductManage', 'MulManage', 'CusInventory']
  if (globalData.value.prodEditNeedAlive) ret.push('ProductEdit')
  if (globalData.value.specEditNeedAlive) ret.push('SpecEdit')
  return ret
})

</script>

