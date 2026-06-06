<template>
  <div class="video-limit-box" :style="{ height: containerHeight }">
    <div class="player-container">
      <div id="mse" ref="playerRef"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import { sleep, getImageUrl, getVideoUrl } from '@/util'

const props = defineProps({
  url: { type: String, default: '' },
  cover: { type: String, default: '' }
})

const playerRef = ref(null);
let player = null;

// 🌟 用响应式高度来接收最终的精准自适应高度，保底 210px
const containerHeight = ref('210px'); 

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
  const videoUrl = getVideoUrl(props.url)
  if (!videoUrl || !playerRef.value) return;

  const cfg = {
    el: playerRef.value,
    url: videoUrl,
    // 🌟 核心：关闭 fluid 流式，我们用物理像素直接灌满容器，拒绝 padding-top 导致的不受控
    fluid: false, 
    width: '100%',
    height: '100%',     
    videoFillMode: 'contain',
    playsinline: true,
    'x5-video-player-type': 'h5-page',
    'x5-video-player-fullscreen': false,
    'x5-video-orientation': 'portrait', 
    playbackRate: false,
    swipeOnPlayer: false, 
    disableGesture: true,
    poster: {
      poster: coverDisplay.value,         
      fillMode: 'cover'                   
    }
  }
  
  player = new Player(cfg);

  // 🌟 终极绝招：监听西瓜播放器的“解析成功”内核事件（走纯单次管道，不影响 Chrome 性能）
  player.once('loadedmetadata', () => {
    if (!player || !player.video) return;
    
    // 1. 直接获取西瓜内核里的真实视频尺寸
    const videoW = player.video.videoWidth;
    const videoH = player.video.videoHeight;
    
    if (!videoW || !videoH) return;

    // 2. 结合手机屏幕宽度等比缩放计算
    const screenWidth = window.innerWidth || 375; 
    let calcHeight = (videoH / videoW) * screenWidth;

    // 3. 严格卡死小红书式的最高上限：480px
    if (calcHeight > 480) {
      calcHeight = 480;
    }

    // 4. 赋值！容器高度瞬间丝滑展开
    containerHeight.value = `${Math.floor(calcHeight)}px`;
  });
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

onMounted(() => {
  initPlayer();
})

onBeforeUnmount(() => {
  destroyPlayer();
});

defineExpose({ pause })
</script>

<style lang="scss" scoped>
.video-limit-box {
  width: 100%;
  background: #000;
  overflow: hidden;
  transition: height 0.15s ease-out; /* 让高度变化稍微有一点点平滑过渡，视觉像小红书展开一样自然 */
}

.player-container {
  width: 100%;
  height: 100%;
  position: relative;

  #mse {
    width: 100% !important;
    height: 100% !important;
  }

  // 完美灌满独立沙盒
  &:deep(.xgplayer) {
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important; // 彻底清除西瓜 fluid 带来的流氓占位干扰

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