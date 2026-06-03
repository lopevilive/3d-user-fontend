
<template>
  <div class="ske-wrap" v-if="globalData.isShowSke">
    <div class="taobao-list">
      <div v-for="i in 6" :key="i" class="product-card-ske">
        <van-skeleton animate>
          <template #template>
            <van-skeleton-image class="product-img-ske" />
            
            <div class="product-info-ske">
              <van-skeleton-paragraph row-width="90%" />
              <van-skeleton-paragraph row-width="60%" />
              
              <div class="product-footer-ske">
                <van-skeleton-paragraph row-width="40%" />
              </div>
            </div>
          </template>
        </van-skeleton>
      </div>
    </div>
  </div>
  <router-view v-slot="{Component}">
    <keep-alive :include="['AlbumList']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <VanOverlay :show="loading" :z-index="10000">
    <VanLoading class="global-loading"  />
  </VanOverlay>
  <!-- 这里的目的是加载样式  s-->
  <VanNotify />
  <VanToast />
  <VanDialog />
  <VanImagePreview />
  <!-- 这里的目的是加载样式  e-->

  <EncryValiDialog ref="encryDialogRef" />
</template>

<script setup>
import { ref } from 'vue'
import { globalLoading, encryRefManage } from '@/util'
import { globalData } from '@/store'
import EncryValiDialog from '@/components/encry-vali-dialog/index.vue'

const loading = ref(false)
globalLoading.setRef(loading)

const encryDialogRef = ref()
encryRefManage.setRef(encryDialogRef)

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

/* 双列网格布局 */
.taobao-list {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 平分两列 */
  gap: 12px; /* 卡片间距 */
  padding: 12px;
  background-color: #f7f8fa; /* 模拟淘宝底色 */
}

/* 商品卡片容器 */
.product-card-ske {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 图片占位：强制 1:1 比例 */
.product-img-ske {
  width: 100% !important;
  height: 170px !important; /* 根据 iPhone 11 屏幕宽度估算，约 170-180px */
  border-radius: 0; /* 顶部图片通常填满卡片 */
}

/* 下方文字区域 */
.product-info-ske {
  padding: 12px 8px;
}

/* 调整段落间距 */
:deep(.van-skeleton-paragraph) {
  margin-top: 8px;
}

.product-footer-ske {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

</style>
