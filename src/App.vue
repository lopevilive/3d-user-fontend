
<template>
  <div class="ske-wrap" v-if="globalData.isShowSke">
    <van-skeleton>
      <template #template>
        <div class="ske-content" v-for="item in new Array(5).fill(0)">
          <div :style="{ display: 'flex', width: '100%' }">
            <van-skeleton-image />
            <div :style="{ flex: 1, marginLeft: '16px' }">
              <van-skeleton-paragraph row-width="60%" />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
              <van-skeleton-paragraph />
            </div>
          </div>
        </div>
      </template>
    </van-skeleton>
  </div>
  <router-view v-slot="{Component}">
    <keep-alive :include="['AlbumList']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <VanOverlay :show="loading">
    <VanLoading class="global-loading"  />
  </VanOverlay>
  <!-- 这里的目的是加载样式  s-->
  <VanNotify />
  <VanToast />
  <VanDialog />
  <VanImagePreview />
  <!-- 这里的目的是加载样式  e-->
</template>

<script setup>
import { ref } from 'vue'
import { globalLoading } from '@/util'
import { globalData } from '@/store'

const loading = ref(false)
globalLoading.setRef(loading)

</script>

<style scoped lang="scss">
.global-loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ske-wrap {
  background: #fff;
  height: 100vh;
  padding: 24px 0;
  box-sizing: border-box;
  :deep(.van-skeleton) {
    display: block;
  }
  :deep(.ske-content) {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
}

</style>
