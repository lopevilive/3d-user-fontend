<template>
  <div class="view-contact-container" v-if="!loading">
    <ImgSwipeV2 :list="imgList" :mode="2" class="top-swipe"/>

    <div class="contact-content-body">
      <div class="shop-profile-card">
        <h2 class="shop-name">{{ shopInfo.name }}</h2>
        <p class="shop-desc" v-if="shopInfo.desc">{{ shopInfo.desc }}</p>
      </div>

      <div class="info-card-group" v-if="shopInfo.showContact === 0">
        <div class="info-item-row" v-if="isShowAddress">
          <div class="info-left">
            <span class="info-label">联系地址</span>
            <span class="info-value text-ellipsis-2">{{ addressDisplay }}</span>
          </div>
          <div class="info-right">
            <VanButton size="small" class="action-btn-weak" text="复制" @click="copyStr(addressDisplay)" />
          </div>
        </div>

        <div class="info-item-row" v-if="isShowConcat">
          <div class="info-left">
            <span class="info-label">联系方式</span>
            <span class="info-value phone-number">{{ shopInfo.phone }}</span>
          </div>
          <div class="info-right">
            <VanButton v-if="shopInfo.phone" size="small" class="action-btn-weak" text="复制" @click="copyStr(shopInfo.phone)"/>
            <VanButton v-if="shopInfo.qrcodeUrl" size="small" type="primary" class="action-btn-main" text="添加微信" @click="toViewQr" />
          </div>
        </div>

        <div class="info-item-row empty-row" v-if="isShowToEdit">
          <div class="info-left">
            <span class="info-label">联系方式</span>
            <span class="info-value placeholder-text">暂未填写联系方式</span>
          </div>
          <div class="info-right">
            <VanButton size="small" type="primary" class="action-btn-main" text="去填写" @click="toEdit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useContact} from './hook'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'
import {globalLoading, copyStr} from '@/util'

const {
  shopInfo,
  init,
  imgList,
  addressDisplay,
  toViewQr,
  isShowConcat,
  isShowToEdit,
  toEdit,
  isShowAddress
} = useContact()

const loading = globalLoading.getRef()

init()


</script>

<style lang="scss" scoped>
.view-contact-container {
  min-height: 100vh;
  background-color: #f7f8fa; // 换成高档微灰背景，突出白色的卡片层级
  padding-bottom: calc(#{$footerBarH} + 20px);
  box-sizing: border-box;

  .top-swipe {
    overflow: hidden;
  }

  .contact-content-body {
    padding: 16px;
  }

  // 店铺名称头部卡片
  .shop-profile-card {
    background: #ffffff;
    padding: 20px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    margin-bottom: 14px;

    .shop-name {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #323233;
      line-height: 1.4;
    }

    .shop-desc {
      margin: 8px 0 0 0;
      font-size: 13px;
      color: #969799;
      line-height: 1.5;
    }
  }

  // 下方联系细节卡片组
  .info-card-group {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    padding: 4px 16px;

    .info-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid #f2f3f5;

      &:last-child {
        border-bottom: none; // 最后一项去掉分割线
      }

      .info-left {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding-right: 12px; // 给右侧按钮留出绝对安全的间距

        .info-label {
          font-size: 12px;
          color: #969799;
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 15px;
          color: #323233;
          line-height: 1.4;
          font-weight: 500;
          word-break: break-all;
          
          &.phone-number {
            font-family: "Helvetica Neue", Arial, sans-serif; // 让数字显示更好看
          }
          
          &.placeholder-text {
            color: #c8c9cc;
            font-weight: normal;
          }
        }
        
        // 限制长地址最多显示2行，优雅不破形
        .text-ellipsis-2 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }

      .info-right {
        display: flex;
        align-items: center;
        flex-shrink: 0; // 按钮区域绝对不被挤压

        .action-btn-weak {
          border-color: #dcdee0;
          color: #646566;
          border-radius: 6px;
          height: 28px;
          padding: 0 12px;
        }

        // 强化主色按钮（添加微信 / 去填写）
        .action-btn-main {
          height: 28px;
          padding: 0 14px;
          border-radius: 6px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(25, 137, 250, 0.15); // 微弱的高级投影
          margin-left: 8px;
        }
      }
    }
    
    // 未填写的特殊样式
    .empty-row {
      background: #fcfdfe;
    }
  }
}
</style>