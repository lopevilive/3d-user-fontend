<template>
  <div class="com-img-swipe-wrap-v2" :key="domKey">
    <div :id="id" class="swiper-container">
      <div class="swiper-wrapper" :style="styleDisplay" >
        <div class="swiper-slide" v-if="videoUrl">
          <AsyncVideo :url="videoUrl" ref="videoPlayerRef" :cover="videoCover" />
          <div v-if="!globalData.isPC" class="swiper-no-swiping no-swiping_video"></div>
          <div v-if="!globalData.isPC" class="no-swiping-video-bottom"></div>
          <!-- 视频下载按钮：绝对定位到右下角 -->
          <div class="video-download-btn" v-if="isShowDownloadVideo" @click.stop="downloadVideoHandle">
            <VanIcon name="down" class="download-icon" />
            <span class="download-text">下载</span>
          </div>
        </div>
        <div class="swiper-slide" v-for="(item, idx) in list" :class="{mode1: mode === 1, mode2: mode === 2}">
          <VanImage :fit="mode === 2 ? 'cover' : 'contain'" :src="getUrl(item)" @click="clickHandle(idx)" lazy-load/>
          <div v-if="!globalData.isPC" class="swiper-no-swiping" @click="clickHandle(idx)"></div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="control-item control-left" @click="prevHandle" v-if="isShowControl">
      <VanIcon name="arrow-left"/>
    </div>
    <div class="control-item control-right" @click="nextHandle" v-if="isShowControl">
      <VanIcon name="arrow"/>
    </div>
  </div>

</template>

<script setup>
import {onMounted, computed, ref, watch, defineAsyncComponent, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { rand, getImageUrl, getVideoUrl, getFlexW, shopInfoManage } from '@/util'
import { showImagePreview, showToast } from 'vant';
import { globalData } from '@/store'

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1}, // 1 | 2
  scale: {type: String, default: '0.5'},
  autoplay: {type: Number, default: 0},
  width: {type: Number, default: 375},
  videoUrl: {type: String, default: ''}, // 视频连接
  videoCover: {type: String, default: ''}, // 视频封面
})

const route = useRoute()
const shopId = + route.params.shopId

const shopInfo = ref({})

let inited = false
const id = `swipe-${rand(10000, 99999)}`
const domKey = ref(rand(10000, 99999))
const swiperInstance = ref(null)

const AsyncVideo = defineAsyncComponent({
  loader: () => import('@/components/video-player/index.vue')
})

const styleDisplay = computed(() => {
  let ret = '';
  if (props.mode === 2) {
    const h = getFlexW(props.width * Number(props.scale))
    ret += `height: ${h}px;`
  }
  const w = getFlexW(props.width)
  ret += `width: ${w}px;`
  return ret
})

const getUrl = (url) => {
  return getImageUrl(url, {shopId})
}

const displayPreviewList = computed(() => {
  let ret = []
  for (const item of props.list) {
    ret.push(getImageUrl(item, {qua: 95, w: 1080}))
  }
  return ret
})

const clickHandle = (idx) => {
  if (globalData.value.isPC) return
  showImagePreview(displayPreviewList.value, idx)
}

const isShowDownloadVideo = computed(() => {
  if (globalData.value.rid === 99) return true
  return false

  if ([2,3,99].includes(globalData.value.rid)) return true
  if (shopInfo.value.downloadVideo === 1) return true
  return false
  
})

// 下载视频：跳转小程序原生下载页，由小程序侧解析 payload 并保存
const downloadVideoHandle = () => {
  const url = getVideoUrl(props.videoUrl)
  if (!url) return
  if (typeof wx === 'undefined' || !wx.miniProgram || !globalData.value.userInfo?.userId) {
    showToast('请在小程序内打开')
    return
  }
  const payload = {
    url,
    type: 2, // 2-视频
    fileName: `视频_${Date.now()}.mp4`
  }
  const payloadStr = encodeURIComponent(JSON.stringify(payload))
  wx.miniProgram.navigateTo({ url: `../download-page/downloadPage?payload=${payloadStr}` })
}

const isShowControl = computed(() => {
  let len = props.list?.length || 0
  if (props.videoUrl) len += 1
  if (len === 1) return false
  if (globalData.value.isPC) return true
  return false
})

const prevHandle = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slidePrev()
  }
}

const nextHandle = () => {
  if (swiperInstance.value) {
    swiperInstance.value.slideNext()
  }
}

const videoPlayerRef = ref()
const createSwipe = async () => {
  // 先销毁旧的 Swiper 实例
  if (swiperInstance.value) {
    domKey.value = rand(10000, 99999)
    swiperInstance.value.destroy(true, true)
    swiperInstance.value = null
    await nextTick()
  }

  const config = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    modules: [Pagination, Navigation],
    preventClicks: true, // 防止点击穿透
    on: {
      slideChange: (swiper) => {
        // swiper.realIndex 指的是当前不受 loop 复制影响的、真实的 Slide 索引
        // 如果有视频的情况下，第一个 Slide (realIndex 为 0) 就是视频页
        if (props.videoUrl && swiper.realIndex !== 0) {
          // 用户滑出了视频页，调用播放器子组件的 pause 暂停视频
          if (videoPlayerRef.value && typeof videoPlayerRef.value.pause === 'function') {
            videoPlayerRef.value.pause()
          }
        }
      }
    }
  }

  if (globalData.value.isPC) {
    config.allowTouchMove = false
    config.simulateTouch = false
    config.grabCursor = false
    config.allowTouchMove = false
  }

  // 当 autoplay 大于 0 时才启用自动轮播
  if (props.autoplay > 0) {
    config.autoplay = {
      delay: props.autoplay,
      disableOnInteraction: false,
    }
    config.modules.push(Autoplay)
  }

  swiperInstance.value = new Swiper(`#${id}`, config)
}
watch([
  () => props.list,
  () => props.mode,
  () => props.width,
  () => props.scale,
  () => props.autoplay,
],
  () => {
    if (inited === false) return
    createSwipe()
  },
  {deep: true}
)

const init = async () => {
  await createSwipe()
  const [info] = await shopInfoManage.getData(shopId)
  shopInfo.value = info
  inited = true
}

onMounted(init)

</script>

<style lang="scss" scoped>
.com-img-swipe-wrap-v2 {
  box-sizing: border-box;
  position: relative;
  :deep(.swiper-pagination) {
    pointer-events: none;
  }
  .swiper-container {
    width: 100%;
    overflow: hidden;
  }
  .swiper-wrapper {
    height: 100%;
    align-items: center;
  }

  .swiper-slide {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    position: relative;
    &.mode1 {
      min-height: 200px;
    }
    &.mode2 {
      :deep(.van-image) {
        height: 100%;
      }
    }
    :deep(.van-image) {
      width: 100%;
    }
    :deep(.van-image__img) {
      max-height: 480px;
    }
    .swiper-no-swiping {
      position: absolute;
      width: 10%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 10;
    }
    .no-swiping_video {
      height: calc(100% - 50px);
    }
    .no-swiping-video-bottom {
      position: absolute;
      width: 18px;
      height: 50px;
      bottom: 0;
      left: 0;
      z-index: 10;
    }
    /* 视频下载按钮：右下角 */
    .video-download-btn {
      position: absolute;
      right: 12px;
      top: 12px;
      z-index: 20;
      display: flex;
      align-items: center;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: $fsL;
      color: #fff;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);

      .download-icon {
        margin-right: 4px;
        font-size: 14px;
      }

      &:active {
        background: rgba(0, 0, 0, 0.72);
      }
    }
  }
  .control-item {
    position: absolute;
    top: 50%;
    background: rgba(0,0,0,.5);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    z-index: 10;
    color: #fff;
  }
  .control-left {
    left: 10px;
  }
  .control-right {
    right: 10px;
  }
}

</style>