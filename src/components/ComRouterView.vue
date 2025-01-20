
<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="['ProductManage', 'MulManage']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <FooterBar />
</template>

<script setup>
import FooterBar from '@/components/footer-bar/index.vue'

</script>

