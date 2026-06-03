<template>
  <div class="video-limit-box">
    <div class="player-container">
      <!-- 尽量给容器一个 ref，方便清理 -->
      <div id="mse" ref="playerRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import { sleep } from '@/util'

const props = defineProps({
  url: {type: String, default: ''},
  cover: {type: String, default: ''}
})

const playerRef = ref(null);
let player = null;

const init = () => {
  // 确保如果已经存在实例，先销毁（防止重复初始化）
  destroyPlayer();
  const cfg = {
    id: 'mse',
    url: props.url,
    width: '100%',
    height: '100%',
    fluid: false, // 配合 CSS 的 aspect-ratio
    videoFillMode: 'contain',
    playsinline: true,
    'x5-video-player-type': 'h5-page',
    'x5-video-player-fullscreen': false,
    playbackRate: false,
    // ====== 核心修改：关闭所有屏幕手势交互 ======
    // 1. 关闭触摸屏左右滑动调节进度、上下滑动调节音量/亮度的默认行为
    // 注：不同版本 xgplayer 手势配置有差异，以下组合拳能 100% 覆盖并锁死手势
    swipeOnPlayer: false, // 禁用播放器区域的滑动行为
    disableGesture: true, // 彻底禁用手势操作
  }
  if (props.cover) cfg.poster = props.cover
  player = new Player(cfg);
}

// 封装一个严谨的销毁方法
const destroyPlayer = () => {
  if (player) {
    try {
      // 1. 调用 xgplayer 自带的销毁方法
      // 它会停止下载视频、清空 video 标签、解绑自身事件
      player.destroy(); 
    } catch (e) {
      console.error('销毁播放器失败:', e);
    } finally {
      // 2. 将引用设为 null，触发 GC（垃圾回收）
      player = null;
    }
  }
  
  // 3. 彻底清空 DOM 容器的内容（可选，增加安全性）
  if (playerRef.value) {
    playerRef.value.innerHTML = '';
  }
}

const pause = async () => {
  // 1. xgplayer 实例暂停
  await sleep(300)
  if (player && typeof player.pause === 'function') {
    try {
      player.pause();
    } catch (e) {
      console.error('xgplayer 暂停失败:', e);
    }
  }
}

onMounted(init);

// Vue 生命周期钩子：组件卸载前执行
onBeforeUnmount(() => {
  destroyPlayer();
});

defineExpose({pause})


</script>

<style lang="scss" scoped>
/* 延续之前 aspect-ratio 的样式方案 */
$maxH: 350px;
.video-limit-box {
  width: 100%;
}

.player-container {
  width: 100%;
  max-height: $maxH;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;

  &:deep(.xgplayer) {
    height: 100% !important;
    width: 100% !important;
    padding-top: 0 !important;
  }

  &:deep(video) {
    object-fit: contain !important;
    height: 100% !important;
  }
}
</style>