
<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="aliveList">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <FooterBar ref="footerBarRef" />
</template>

<script setup>
import FooterBar from '@/components/footer-bar/index.vue'
import { computed, ref } from 'vue'
import { globalData } from '@/store'

const aliveList = computed(() => {
  const ret = ['ProductManage', 'MulManage', 'CusInventory', 'CustomHome']
  if (globalData.value.prodEditNeedAlive) ret.push('ProductEdit')
  if (globalData.value.specEditNeedAlive) ret.push('SpecEdit')
  if (globalData.value.homeModNeedAlive) ret.push('HomeMod')
  return ret
})

const footerBarRef = ref()

globalData.value.getFooterBarRef = () => {
  return footerBarRef
}

</script>

