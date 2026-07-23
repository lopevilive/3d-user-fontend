<template>
  <div class="pu-batch">
    <!-- 移动端提示遮罩 -->
    <div v-if="showMobileTip" class="mobile-mask">
      <div class="mobile-tip-card">
        <div class="tip-icon">🖥</div>
        <div class="tip-title">请使用电脑访问</div>
        <div class="tip-desc">批量上传功能仅支持 PC 端浏览器打开，请使用电脑访问此页面。</div>
      </div>
    </div>

    <!-- ===== 手动上传（暂隐藏） ===== -->
    <!--
    <a-tabs v-model:activeKey="activeTab" class="pu-tabs" :tabBarGutter="0">
      <a-tab-pane key="manual">
        <template #title>
          <IconEdit class="tab-icon" />
          手动上传
        </template>
        <ManualUpload />
      </a-tab-pane>

      <a-tab-pane key="zip">
        <template #title>
          <IconFolder class="tab-icon" />
          ZIP上传
        </template>
        <ZipUpload />
      </a-tab-pane>
    </a-tabs>
    -->

    <!-- 链接过期提示 -->
    <div v-if="linkExpired" class="expired-mask">
      <div class="expired-tip-card">
        <div class="tip-icon">🔗</div>
        <div class="tip-title">链接已过期</div>
        <div class="tip-desc">当前链接已失效，请返回重新复制链接后再访问。</div>
      </div>
    </div>

    <!-- ZIP上传 -->
    <ZipUpload v-if="!linkExpired" :shopId="shopId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconEdit, IconFolder } from '@arco-design/web-vue/es/icon'
import { Tabs as ATabs, TabPane as ATabPane } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import { mobileRegex, commonFetch } from '@/util'
import ManualUpload from './components/ManualUpload.vue'
import ZipUpload from './components/ZipUpload.vue'
import {validBatchUploadToken} from '@/http'
import { globalData } from '@/store'


const route = useRoute()

const activeTab = ref('manual')
const showMobileTip = ref(false)
const linkExpired = ref(false)
const shopId = ref()

onMounted(async () => {
  try {
    const ua = navigator.userAgent
    if (mobileRegex.test(ua)) {
      showMobileTip.value = true
      return
    }
    const {ticket} = route.query
    if (!ticket) {
      linkExpired.value = true
      return
    }
    const {shopId: sId, userId, token} = await commonFetch(validBatchUploadToken, {ticket})
    globalData.value.userInfo.userId = userId
    shopId.value = sId
    sessionStorage.setItem('token', token)
  } catch(e) {
    linkExpired.value = true
  }
})
</script>

<style scoped lang="scss">
.pu-batch {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f7f9; 
  padding: 16px 20px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.pu-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.arco-tabs-content) {
    flex: 1;
    overflow: hidden;
    padding: 0 !important;
    .arco-tabs-content-list {
      height: 100%;
      .arco-tabs-pane {
        height: 100%;
      }
    }
  }
  :deep(.arco-tabs-content-inner) {
    height: 100%;
  }
  :deep(.arco-tabs-nav) {
    margin-bottom: 16px;
  }
  :deep(.arco-tabs-nav-tab) {
    gap: 0;
  }
  :deep(.arco-tabs-tab) {
    padding: 8px 20px;
    font-size: 15px;
    border-radius: 8px 8px 0 0;
    transition: all 0.2s;

    .tab-icon {
      margin-right: 6px;
      font-size: 16px;
    }
  }
}
.mobile-mask,
.expired-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #f4f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-tip-card,
.expired-tip-card {
  text-align: center;
  padding: 48px 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  max-width: 340px;

  .tip-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .tip-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 12px;
  }

  .tip-desc {
    font-size: 14px;
    color: #86909c;
    line-height: 1.6;
  }
}
</style>
