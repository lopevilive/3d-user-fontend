<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="com-dialog-video" @click.self="handleClose">
        <div class="dialog-content">
          <div class="video-box">
            <AsyncVideo :url="videoUrl" />
          </div>
          <div class="close-btn" @click="handleClose">
            <van-icon name="cross" class="close-icon" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

// 控制弹窗显示隐藏与视频地址
const visible = ref(false)
const videoUrl = ref('')

const AsyncVideo = defineAsyncComponent({
  loader: () => import('@/components/video-player/index.vue')
})

/**
 * 暴露给外部的主动唤起方法
 * @param {Object} payload 参数对象
 * @param {string} payload.url 视频地址
 */
const show = (payload) => {
  if (payload && payload.url) {
    // videoUrl.value = payload.url
    videoUrl.value = '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/video/trans_5_3_a2b96faeb02581770a4736f61bd3b6b7.mp4'
    visible.value = true
  } else {
    console.warn('show 方法缺少有效的视频 url');
  }
}

// 关闭弹窗的统一处理器
const handleClose = () => {
  // 2. 关闭弹窗并重置数据
  visible.value = false
  videoUrl.value = ''
}

// 必须使用 defineExpose 显式暴露 show 方法
defineExpose({ show })
</script>

<style lang="scss" scoped>
.com-dialog-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9); // 90% 不透明度的质感黑
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000; // 绝对置顶
  touch-action: none; // 阻止移动端/小程序 web-view 的滚动穿透
}

.dialog-content {
  width: 95%; // 左右留出安全边距
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px; // 播放器与下方关闭按钮的间距
}

.video-box {
  width: 100%;
  border-radius: 6px; // 稍微给点圆角，细节质感更好
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

.close-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.5); // 半透明白框
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background-color: rgba(255, 255, 255, 0.1); // 点击态视觉反馈
    transform: scale(0.92);
  }

  .close-icon {
    font-size: 22px; // 控制 X 图标的大小
  }
}

// 淡入淡出动画控制
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>