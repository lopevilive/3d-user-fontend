<template>
  <VanDialog
    v-model:show="isShow"
    :showConfirmButton="false"
    showCancelButton
    cancel-button-text="关闭"
    closeOnClickOverlay
    title="批量上传"
  >
    <div class="view-com-batch-upload-tips">
      <div class="tips-icon">
        <VanIcon name="desktop-o" />
      </div>
      <div class="tips-title">请使用电脑打开</div>
      <div class="tips-desc">批量上传功能仅支持 PC 端浏览器，请复制下方链接在电脑中打开</div>
      <div class="link-box">
        <span class="link-text">{{ batchLink }}</span>
        <VanButton
          text="复制链接"
          size="small"
          type="primary"
          class="copy-link-btn"
          @click="copyLink"
        />
      </div>
      <div class="tips-expiry">
        <VanIcon name="info-o" class="expiry-icon" />
        链接有效期为 90 分钟，到期后需重新复制
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { copyStr } from '@/util'

const isShow = ref(false)

const token = ref('')
const batchLink = computed(() => {
  if (!token.value) return ''
  return `${location.origin}/dist/pc-view/batch-upload?ticket=${token.value}`
})

const show = async (str) => {
  token.value = str
  isShow.value = true
}

const copyLink = () => {
  copyStr(batchLink.value)
}

defineExpose({show})
</script>

<style scoped>
.view-com-batch-upload-tips {
  padding: 32px 24px 24px;
  text-align: center;
}

.tips-icon {
  margin-bottom: 16px;
}

.tips-icon :deep(.van-icon) {
  font-size: 48px;
  color: #2f54eb;
}

.tips-title {
  font-size: 18px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 10px;
}

.tips-desc {
  font-size: 13px;
  color: #969799;
  line-height: 1.6;
  margin-bottom: 20px;
}

.link-box {
  display: flex;
  align-items: center;
  background: #f7f8fa;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 4px;
}

.link-text {
  flex: 1;
  font-size: 12px;
  color: #4e5969;
  padding: 8px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: all;
}

.copy-link-btn {
  flex-shrink: 0;
  height: 32px !important;
  padding: 0 14px !important;
  border-radius: 6px !important;
}

.tips-expiry {
  margin-top: 16px;
  font-size: 12px;
  color: #fa8c16;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  .expiry-icon {
    font-size: 14px;
  }
}
</style>
