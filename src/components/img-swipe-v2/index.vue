<template>
  <div class="com-img-swipe-wrap-v2" :key="domKey">
    <div :id="id" class="swiper-container">
      <div class="swiper-wrapper" :style="styleDisplay" >
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
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { rand, E_img_qua_map, getImageUrl, getFlexW, sleep } from '@/util'
import {onMounted, computed, ref, watch} from 'vue'
import { useRoute } from 'vue-router'
import { showImagePreview } from 'vant';
import { globalData } from '@/store'

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1}, // 1 | 2
  scale: {type: String, default: '0.5'},
  autoplay: {type: Number, default: 0},
  width: {type: Number, default: 375},
})

const route = useRoute()
const shopId = + route.params.shopId

let inited = false
const id = `swipe-${rand(10000, 99999)}`
const domKey = ref(rand(10000, 99999))
const swiperInstance = ref(null)

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
  if (!shopId) return getImageUrl(url)
  const cfgItem = E_img_qua_map.find((item) => item.shopId === shopId)
  if (!cfgItem) return getImageUrl(url)
  return getImageUrl(url, cfgItem.qua)
}

const displayPreviewList = computed(() => {
  let ret = []
  for (const item of props.list) {
    ret.push(getUrl(item))
  }
  return ret
})

const clickHandle = (idx) => {
  if (globalData.value.isPC) return
  showImagePreview(displayPreviewList.value, idx)
}

const isShowControl = computed(() => {
  if (props.list?.length === 1) return false
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

const createSwipe = async () => {
  // 先销毁旧的 Swiper 实例
  if (swiperInstance.value) {
    domKey.value = rand(10000, 99999)
    swiperInstance.value.destroy(true, true)
    swiperInstance.value = null
    await sleep(200)
  }

  const config = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    modules: [Pagination, Navigation],
    preventClicks: true, // 防止点击穿透
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
  inited = true
}

onMounted(init)

</script>

<style lang="scss" scoped>
.com-img-swipe-wrap-v2 {
  box-sizing: border-box;
  position: relative;
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
      width: 20%;
      height: 100%;
      // background: red;
      top: 0;
      left: 0;
      z-index: 10;
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