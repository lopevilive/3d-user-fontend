<template>
  <div class="view-album-list">
    <div class="list" @scroll="scrollHandle" ref="listRef">
      <div class="cond-wrap">
        <div class="cond-item">
          <VanField placeholder="关键词" v-model="searchCond.str" />
        </div>
        <div class="cond-item">
          <VanField placeholder="店铺id" v-model="searchCond.shopId" />
        </div>
        <div class="cond-item">
          <VanField placeholder="status" v-model="searchCond.status" />
        </div>
        <div class="cond-item">
          <VanField placeholder="auditing" v-model="searchCond.auditing" />
        </div>
        <VanButton text="搜索" block @click="initLoad"/>
      </div>
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
  listRef,
  searchCond,
  initLoad
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
  .cond-wrap {
    display: flex;
    flex-wrap: wrap;
    .cond-item {
      width: 50%;
    }
  }
}

</style>