<template>
  <div class="view-contact-container" v-if="!loading">
    <!-- 顶部轮播 -->
    <ImgSwipeV2 :list="imgList" :mode="2" class="top-swipe"/>

    <div class="contact-content-body">
      <!-- 店铺头部卡片 -->
      <div class="shop-header-card">
        <div class="shop-header-top">
          <div class="shop-avatar">
            <VanImage v-if="imgList[0]" :src="getImageUrl(imgList[0])" fit="cover" class="avatar-img" />
            <span v-else class="avatar-text">{{ shopInfo.name?.charAt(0) || '店' }}</span>
          </div>
          <div class="shop-info">
            <h2 class="shop-name">{{ shopInfo.name }}</h2>
          </div>
        </div>
        <p class="shop-desc" v-if="shopInfo.desc">{{ shopInfo.desc }}</p>
        <VanButton
          round
          block
          class="header-share-btn"
          icon="share-o"
          @click="shareHandle"
          v-if="isShowShareBtn"
        >
          分享图册
        </VanButton>
      </div>

      <!-- 联系信息卡片组 -->
      <div class="info-card-group" v-if="shopInfo.showContact === 0">
        <!-- 地址 -->
        <div class="info-item-row" v-if="isShowAddress">
          <div class="info-icon-box location-icon">
            <VanIcon name="location-o" />
          </div>
          <div class="info-content">
            <span class="info-label">联系地址</span>
            <span class="info-value">{{ addressDisplay }}</span>
          </div>
          <VanButton size="small" plain class="copy-btn" @click="copyStr(addressDisplay)">复制</VanButton>
        </div>

        <div class="info-divider" v-if="isShowAddress && isShowConcat"></div>

        <!-- 电话 + 微信 -->
        <div class="info-item-row" v-if="isShowConcat">
          <div class="info-icon-box phone-icon">
            <VanIcon name="phone-o" />
          </div>
          <div class="info-content">
            <span class="info-label">联系方式</span>
            <span v-if="shopInfo.phone" class="info-value phone-number">{{ shopInfo.phone }}</span>
            <div class="info-actions">
              <VanButton v-if="shopInfo.phone" size="small" plain round class="chip-btn" @click.stop="copyStr(shopInfo.phone)">复制号码</VanButton>
              <VanButton v-if="shopInfo.qrcodeUrl" size="small" type="primary" round class="chip-btn primary" @click.stop="toViewQr">添加微信</VanButton>
            </div>
          </div>
        </div>

        <!-- 未填写 -->
        <div class="info-item-row empty-row" v-if="isShowToEdit">
          <div class="info-icon-box empty-icon">
            <VanIcon name="location-o" />
          </div>
          <div class="info-content">
            <span class="info-label">联系方式</span>
            <span class="info-value placeholder-text">暂未填写联系方式</span>
          </div>
          <VanButton size="small" type="primary" round class="chip-btn primary" @click="toEdit">去填写</VanButton>
        </div>
      </div>
    </div>

    <DialogImgs ref="dialogImgsRef" />
  </div>
</template>

<script setup>
import {useContact} from './hook'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'
import DialogImgs from '@/components/dialog-imgs/index.vue'
import {globalLoading, copyStr, getImageUrl} from '@/util'

const {
  shopInfo, init, imgList, addressDisplay, toViewQr, isShowConcat, isShowToEdit, toEdit, isShowAddress, dialogImgsRef,
  isShowShareBtn, shareHandle
} = useContact()

const loading = globalLoading.getRef()

init()
</script>

<style lang="scss" scoped>
.view-contact-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4ff 0%, #f7f8fa 100%);
  padding-bottom: calc(#{$footerBarH} + 20px);
  box-sizing: border-box;

  .top-swipe {
    overflow: hidden;
  }

  .contact-content-body {
    padding: 16px;
    margin-top: -12px;
    position: relative;
    z-index: 2;
  }

  /* ===== 店铺头部卡片 ===== */
  .shop-header-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    margin-bottom: 16px;

    .shop-header-top {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-share-btn {
      margin-top: 16px;
      width: 100%;
      height: 44px !important;
      border: none !important;
      border-radius: 12px !important;
      background: linear-gradient(135deg, #2f54eb 0%, #1d39c4 100%) !important;
      color: #ffffff !important;
      font-size: 15px !important;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(47, 84, 235, 0.25);

      :deep(.van-icon) {
        font-size: 18px;
        margin-right: 4px;
      }

      &:active {
        opacity: 0.85 !important;
      }
    }

    .shop-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      overflow: hidden;
      background: linear-gradient(135deg, #2f54eb 0%, #1d39c4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(47, 84, 235, 0.2);

      .avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 14px;
      }

      .avatar-text {
        font-size: 22px;
        font-weight: 500;
        color: #ffffff;
      }
    }

    .shop-info {
      flex: 1;
      min-width: 0;

      .shop-name {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #1d2129;
        line-height: 1.4;
      }
    }

    .shop-desc {
      margin: 10px 0 0 0;
      font-size: 13px;
      color: #86909c;
      line-height: 1.5;
    }
  }

  /* ===== 信息卡片组 ===== */
  .info-card-group {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    .info-item-row {
      display: flex;
      align-items: flex-start;
      padding: 18px 20px;
      cursor: default;
      transition: background 0.2s;

      &:active {
        background: #f7f9fc;
      }
    }

    .info-divider {
      height: 1px;
      background: #f2f3f5;
      margin: 0 20px;
    }

    /* 图标盒 */
    .info-icon-box {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-right: 14px;

      :deep(.van-icon) {
        font-size: 20px;
      }

      &.location-icon {
        background: #f0f5ff;
        color: #2f54eb;
      }

      &.phone-icon {
        background: #f0fff0;
        color: #00b42a;
      }

      &.empty-icon {
        background: #fff7e6;
        color: #fa8c16;
      }
    }

    /* 内容区域 */
    .info-content {
      flex: 1;
      min-width: 0;

      .info-label {
        font-size: 12px;
        color: #86909c;
        margin-bottom: 4px;
        display: block;
      }

      .info-value {
        font-size: 15px;
        color: #1d2129;
        line-height: 1.5;
        font-weight: 500;
        word-break: break-all;
        display: block;

        &.phone-number {
          font-family: "SF Mono", "Helvetica Neue", monospace;
          letter-spacing: 0.5px;
        }

        &.placeholder-text {
          color: #c9cdd4;
          font-weight: 400;
        }
      }

      .info-actions {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
    }

    /* Vant 按钮统一样式覆盖 */
    .copy-btn {
      flex-shrink: 0;
      margin-left: 12px;
      margin-top: 4px;
      border-color: #dcdee0 !important;
      color: #646566 !important;
      border-radius: 6px !important;
      height: 28px !important;
      line-height: 26px !important;
      font-size: 12px !important;
      padding: 0 12px !important;
    }

    .chip-btn {
      height: 28px !important;
      line-height: 26px !important;
      font-size: 12px !important;
      padding: 0 14px !important;

      &.primary {
        box-shadow: 0 2px 8px rgba(47, 84, 235, 0.2);
      }
    }

    /* 空状态 */
    .empty-row {
      align-items: center;
    }

    .empty-state {
      padding: 48px 20px;
      text-align: center;

      :deep(.van-icon) {
        font-size: 48px;
        color: #c9cdd4;
        margin-bottom: 12px;
      }

      .empty-text {
        margin: 0;
        font-size: 14px;
        color: #86909c;
      }
    }
  }
}
</style>
