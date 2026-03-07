<template>
  <div class="com-img-swipe-wrap-v2">
    <div :id="id" class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, idx) in displayPreviewList">
          <VanImage :fit="mode === 2 ? 'cover' : 'contain'" :src="getUrl(item)" @click="clickHandle(idx)" lazy-load/>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>

</template>

<script setup>
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { rand, E_img_qua_map, getImageUrl } from '@/util'
import {onMounted, computed, ref} from 'vue'
import { useRoute } from 'vue-router'
import { showImagePreview } from 'vant';

const props = defineProps({
  list: {type: Array, default: () => []},
  mode: {type: Number, default: 1}, // 1 | 2
  scale: {type: String, default: '0.5'},
  autoplay: {type: Number, default: 0},
  width: {type: Number, default: 375},
})

const route = useRoute()
const shopId = + route.params.shopId

const id = `swipe-${rand(10000, 99999)}`
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

const init = async () => {

  const swiper = new Swiper(`#${id}`,{
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    modules: [Autoplay, Pagination],
    preventClicks: true, // 防止点击穿透
  })

}

onMounted(init)




</script>

<style lang="scss" scoped>
.com-img-swipe-wrap-v2 {
  .swiper-container {
    width: 375px;
  }
  .swiper-slide {
    width: 100%;
    margin: auto 0;
    :deep(.van-image) {
      width: 100%;
    }
    :deep(.van-image__img) {
      max-height: 480px;
    }
  }
}

</style>