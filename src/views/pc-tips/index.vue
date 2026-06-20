<template>
  <div class="view-pc-tips">
    <div class="card">
      <div class="icon-wrapper">
        <svg class="icon-device" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span class="error-badge">✕</span>
      </div>

      <h2 class="title">仅限手机端访问</h2>
      <p class="description">
        为了保障最佳的浏览体验，本页面仅支持手机移动端访问。请使用手机微信或浏览器打开链接。
      </p>
    </div>
  </div>
</template>

<script setup>
// 纯静态提示
</script>

<style scoped lang="scss">
.view-pc-tips {
  // 使用 fixed 全屏居中，确保背景色完美铺满，不受父级容器死高影响
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #111827; // 采用你截图中的深色系背景
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
  z-index: 9999;

  .card {
    background: #1f2937; // 深灰色卡片背景
    border-radius: 16px;
    padding: 32px 24px;
    width: 320px; // 严格限制卡片宽度，防止在 PC 上显得过大
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  // 图标区域控制
  .icon-wrapper {
    position: relative;
    width: 64px;  // 缩小圆圈尺寸
    height: 64px;
    margin: 0 auto 20px;
    background: rgba(239, 68, 68, 0.1); // 淡淡的红底
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f87171; // 柔和的警示红

    .icon-device {
      width: 32px; // 缩小电脑图标
      height: 32px;
    }

    .error-badge {
      position: absolute;
      bottom: 6px;
      right: 6px;
      background: #ef4444;
      color: white;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border: 2px solid #1f2937; // 融合卡片背景色
    }
  }

  // 文字大小控制
  .title {
    font-size: 18px; // 降低字号
    color: #f9fafb;
    margin: 0 0 10px 0;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .description {
    font-size: 13px; // 降低字号
    color: #9ca3af;
    line-height: 1.5;
    margin: 0;
    padding: 0 8px;
  }
}
</style>