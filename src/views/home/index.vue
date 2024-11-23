<template>
  <div class="view-home" v-if="!loading">
    <div style="height: 1px;"></div>
    <div class="header mrM" v-if="!mineList?.length">
      <span class="text">我也想做一本云画册？</span>
      <VanButton class="btn" size="small" @click="toAlbum">立即创建</VanButton>
    </div>
    <div v-else>
      <h3 class="mrM">我的图册</h3>
      <Card class="mrM" v-for="item in mineList" :data="item" />
    </div>
    <template v-if="logList.length">
      <h3 class="mrM">最近浏览</h3>
      <Card class="mrM" v-for="item in logList" :data="item" />
    </template>
    <template v-if="demoList.length">
      <h3 class="mrM">案例图册</h3>
      <Card class="mrM" v-for="item in demoList" :data="item" />
    </template>
  </div>
</template>


<script setup>
import Card from '@/components/card/index.vue'
import { useHome } from './hook'

const {
  loading,
  toAlbum,
  init,
  mineList,
  logList,
  demoList
} = useHome()

init()
  
</script>

<style scoped lang="scss">
.view-home {
  .text {
    font-size: $fsH;
    color: #000;
  }
  .header {
    background: $bgWhite;
    border-radius: $bdrH;
    display: flex;
    padding: 40px 0;
    align-items: center;
    flex-direction: column;
    box-shadow: $shadow;
    .btn {
      margin-top: $mrL;
    }
  }
}
</style>


