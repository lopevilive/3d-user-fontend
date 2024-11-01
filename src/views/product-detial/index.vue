<template>
  <div class="view-product-detial">
    <div class="swipe-wrap">
      <ImgSwipe :list="imgList" />
      <VanButton v-if="[1,2].includes(info.type3D)" class="see-3d" icon="eye-o" text="720°全景图" size="mini" @click="handleView3D"/>
    </div>
    <div class="name-share">
      <div class="left">
        <div class="name">{{ info.name }}</div>
        <div class="price" v-if="info.price">¥ {{ info.price }}</div>
      </div>
      <VanButton size="small" icon="share-o" icon-position="right">分享</VanButton>
    </div>
    <div class="desc-content">
      <div class="desc-list">
        <div class="list-item" v-for="item in descDisplay">
          <div class="name">{{item.label}}：</div>
          <div class="desc">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <div class="desc-content" v-if="insideDesc.length">
      <div class="tit">内部参数(不向客户展示)</div>
      <div class="desc-list">
        <div class="list-item" v-for="item in insideDesc">
          <div class="name">{{item.label}}：</div>
          <div class="desc">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <ModelDisplay ref="modelDisplayRef" :productInfo="info"/>
    <Setting :runtimeData="info" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ModelDisplay from '@/components/model-display/index.vue'
import Setting from '@/components/setting/index.vue'
import { useProductDetial } from './hook'
import ImgSwipe from '@/components/img-swipe/index.vue'

const {
  info,
  imgList,
  descDisplay,
  handleView3D,
  init,
  modelDisplayRef,
  insideDesc
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
  .name-share {
    padding: $pdM;
    display: flex;
    background: $bgWhite;
    margin-top: 1px;
    .left {
      margin-right: $mrL;
      flex: 1;
    }
    .name {
      line-height: 20px;
      font-weight: bold;
      font-size: $fsH;
    }
    .price {
      color: $red;
      font-size: $fsH;
      font-weight: bold;
      margin-top: $mrL;
    }
    .share {
      flex-shrink: 0;
    }
  }
  .desc-content {
    margin-top: $mrL;
    .tit {
      padding: $pdL $pdM;
      font-weight: bold;
    }
    .desc-list {
      .list-item {
        display: flex;
        border-bottom: 1px solid #e3e3e3;
        padding: $pdL 0;
        padding: $pdL $pdM;
        background: $bgWhite;
        font-size: 12px;
        .name {
          width: 70px;
          flex-shrink: 0;
        }
        .desc {
          flex: 1;
          color: $grey;
        }
        
      }
    }
  }
}

</style>


