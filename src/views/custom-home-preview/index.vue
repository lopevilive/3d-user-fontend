<template>
  <CustomHome />
</template>

<script setup>
import CustomHome  from '@/views/custom-home/index.vue'
import { onUnmounted } from 'vue'
import { globalData } from '@/store'

onUnmounted(() => {
  setTimeout(() => {
    globalData.value.homeModNeedAlive = false
  }, 1000);
})

</script>