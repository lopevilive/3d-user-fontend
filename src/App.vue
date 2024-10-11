
<template>
  <router-view></router-view>
  <VanOverlay :show="loading">
    <VanLoading class="global-loading"  />
  </VanOverlay>
  <!-- 这里的目的是加载样式  s-->
  <VanNotify />
  <VanToast />
  <!-- 这里的目的是加载样式  e-->
</template>

<script setup>
import { ref } from 'vue'
import { globalLoading } from '@/util'

const loading = ref(false)
globalLoading.setRef(loading)

</script>

<style scoped>
.global-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
