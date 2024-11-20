<template>
  <div class="view-product-detial" v-if="!loading">
    <div class="swipe-wrap">
      <ImgSwipe :list="imgList" />
      <VanButton v-if="[1,2].includes(info.type3D)" class="see-3d" icon="eye-o" text="720°全景图" size="mini" @click="handleView3D"/>
    </div>
    <div class="content">
      <div class="content__head">
        <div class="price">
          <template  v-if="info.price">
            <span class="unit">¥</span>
            <span class="num">{{ info.price }}</span>
          </template>
        </div>
        <div class="share">
          <VanButton @click="shareHandle" size="small" icon="share-o" icon-position="right">分享</VanButton>
        </div>
      </div>
      <div class="content__desc">{{ info.desc }}</div>
      <div class="content_attr" v-if="displayAttrs.length">
        <div class="attr-item" v-for="item in displayAttrs">
          <div class="name" >{{ item.name }}</div>
          <div class="val">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <ModelDisplay ref="modelDisplayRef" :productInfo="info"/>
    <Setting :runtimeData="info" />
    <ShareGuide ref="shareGuideRef" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ModelDisplay from '@/components/model-display/index.vue'
import Setting from '@/components/setting/index.vue'
import { useProductDetial } from './hook'
import ImgSwipe from '@/components/img-swipe/index.vue'
import ShareGuide from '@/components/share-guide/index.vue'
import {globalLoading} from '@/util'

const loading = globalLoading.getRef()

const {
  info,
  imgList,
  handleView3D,
  init,
  modelDisplayRef,
  shareGuideRef,
  shareHandle,
  displayAttrs
} = useProductDetial()

onMounted(init)

</script>

<script>
export default {
  name: 'ProductDetial'
}
</script>

<style scoped lang="scss">
.view-product-detial {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .swipe-wrap {
    position: relative;
    .see-3d {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  .content {
    background: $bgWhite;
    padding: $pdM;
    padding-bottom: 40px;
    .content__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price {
        color: $red;
        .unit {
          font-size: 12px;
        }
        .num {
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
    .content__desc {
      margin-top: $mrM;
      white-space: pre-line;
    }
    .content_attr {
      display: flex;
      flex-wrap: wrap;
      .attr-item {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        font-size: 12px;
        padding-right: 10px;
        margin-top: $mrM;
        &:not(:last-child) {
          margin-right: 10px;
          border-right: 0.5px solid $grey9;
        }
        .name {
          color: $grey9;
        }
        .val {
          margin-top: 4px;
          line-height: 14px;
          color: $grey8;
        }
      }
    }
  }
}

</style>


