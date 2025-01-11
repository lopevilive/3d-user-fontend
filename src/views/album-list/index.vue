<template>
  <div class="view-album-list">
    <div class="list" @scroll="scrollHandle" ref="listRef">
      <Card v-for="item in albumList" :data="item"/>
    </div>
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import { useAblumList } from './hook'
import Card from '@/components/card/index.vue'


const {
  scrollHandle,
  loadHandle,
  albumList,
  activeHandle,
  listRef
} = useAblumList()

loadHandle()

onActivated(activeHandle)

</script>

<script>
export default {
  name: 'AlbumList'
}
</script>

<style scoped lang="scss">
.view-album-list {
  height: 100%;
  overflow: hidden;
  .list {
    height: 100%;
    overflow: auto;
  }
}

</style>