<template>
  <div class="video-limit-box" :style="{ height: containerHeight }">
    <div class="player-container">
      <video 
        v-if="!isReady"
        :src="url" 
        preload="metadata" 
        @loadedmetadata="onVideoMetaLoaded"
        style="width: 1px; height: 1px; opacity: 0; position: absolute;"
      ></video>

      <div v-if="isReady" id="mse" ref="playerRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, nextTick, computed } from 'vue'
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import { sleep, getImageUrl } from '@/util'

const props = defineProps({
  url: { type: String, default: '' },
  cover: { type: String, default: '' }
})

const playerRef = ref(null);
let player = null;

// 状态锁：拿到真实比例前绝不乱初始化
const isReady = ref(false);
const containerHeight = ref('210px'); // 默认初始保底高

/**
 * 💥 核心逻辑：当视频元数据在手机端真正加载完成时触发
 */
const onVideoMetaLoaded = async (e) => {
  const videoEl = e.target;
  if (!videoEl) return;
  const videoW = videoEl.videoWidth;
  const videoH = videoEl.videoHeight;
  // 手机屏幕标准宽度为 375 
  const screenWidth = window.innerWidth || 375; 
  // 根据视频真实的宽高比，精准计算出它应该享有的物理高度
  let calcHeight = (videoH / videoW) * screenWidth;
  // 严格锁死最大高度上限为 480px，防止超长竖屏视频崩坏画册排版
  if (calcHeight > 480) {
    calcHeight = 480;
  }
  // 1. 框定好绝对完美的容器高度
  containerHeight.value = `${Math.floor(calcHeight)}px`;
  // 2. 放开闸门，允许渲染 DOM
  isReady.value = true;
  // 3. 等待 Vue DOM 更新后，立刻精准注入西瓜播放器
  await nextTick();
  initPlayer();
}

const coverDisplay = computed(() => {
  let ret = props.cover
  if (!ret) {
    ret = props.url.replace(/trans_/,  'cover_')
    ret = ret.replace(/\.mp4/, '.jpg')
  }
  ret = getImageUrl(ret)
  return ret
})

const initPlayer = () => {
  destroyPlayer();
  if (!props.url || !playerRef.value) return;

  const cfg = {
    el: playerRef.value, // 使用 el 明确指定挂载节点，比 id 更稳
    url: props.url,
    width: '100%',
    height: '100%',     // 🌟 此时高度已经完全由外层精准撑开，直接 100% 灌满，绝不缩水！
    fluid: false, 
    videoFillMode: 'contain',
    playsinline: true,
    'x5-video-player-type': 'h5-page',
    'x5-video-player-fullscreen': false,
    'x5-video-orientation': 'portrait', 
    playbackRate: false,
    swipeOnPlayer: false, 
    disableGesture: true,
    poster: {
      poster: coverDisplay.value,         // 封面的图片地址
      fillMode: 'cover'                   // 强制底层渲染时转为 object-fit: cover 行为（铺满）
    }
  }
  player = new Player(cfg);
}

const destroyPlayer = () => {
  if (player) {
    try {
      player.destroy(); 
    } catch (e) {
      console.error('销毁播放器失败:', e);
    } finally {
      player = null;
    }
  }
}

const pause = async () => {
  await sleep(300)
  if (player && typeof player.pause === 'function') {
    try {
      player.pause();
    } catch (e) {
      console.error('xgplayer 暂停失败:', e);
    }
  }
}

// 极其干净的生命周期
onBeforeUnmount(() => {
  destroyPlayer();
});

defineExpose({ pause })
</script>

<style lang="scss" scoped>
.video-limit-box {
  width: 100%;
  transition: height 0.2s ease; // 增添一丝丝高度动态展开的顺滑过渡动画
  background: #000;
  overflow: hidden;
}

.player-container {
  width: 100%;
  height: 100%;
  position: relative;

  #mse {
    width: 100% !important;
    height: 100% !important;
  }

  // 彻底接管西瓜内部样式，不允许任何隐形层缩水
  &:deep(.xgplayer) {
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important;

    .xg-video-container,
    .xg-poster,
    .xg-trigger,
    .xg-overlay-poster {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
    }
  }

  // 确保控制栏牢牢黏在最底部
  &:deep(.xgplayer-controls) {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    z-index: 10;
  }

  &:deep(video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }
}
</style>