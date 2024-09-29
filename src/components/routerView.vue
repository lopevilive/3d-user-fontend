
<template>
  <router-view v-slot="{Component}">
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" />
  </router-view>
</template>

<script setup>
import {useRoute} from 'vue-router'

const route = useRoute()


</script>

