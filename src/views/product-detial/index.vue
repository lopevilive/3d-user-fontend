<template>
  <div class="view-product-detial" v-if="info.id">
    <div class="down-product-tips" v-if="isShowDownTips">
      产品已下架～
    </div>
    <div class="swipe-wrap">
      <ImgSwipe :list="imgList" />
      <!-- <VanButton v-if="[1,2].includes(info.type3D)" class="see-3d" icon="eye-o" text="720°全景图" size="mini" @click="handleView3D"/> -->
    </div>
    <div class="content">
      <div class="content__head">
        <div class="price">
          <template  v-if="displayPrice">
            <span class="unit">¥</span>
            <span class="num">{{ displayPrice }}</span>
          </template>
        </div>
        <div class="share" v-if="isShowShare">
          <VanButton @click="shareHandle" size="small" icon="share-o" icon-position="right">分享</VanButton>
        </div>
      </div>
      <div class="content__specs" v-if="specsDisplay.length">
        <div class="specs-left">
          <div class="spec__content">
            <div
              class="spec-item"
              :class="{active: index === selectedSpecIdx}"
              v-for="(item, index) in specsDisplay"
              :key="item.name"
              @click="specItemClickHandle(index)"
            >
              <VanImage fit="cover" :src="getImageUrl(item.url)" v-if="isShowSpecImg(item)" lazy-load />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div @click="viewSpecDetialHandle" class="specs-right">{{specsDisplay.length}}款可选<VanIcon name="arrow"/></div>
      </div>
      <div class="content__desc">
        <span v-if="isShowSticky"><VanTag plain type="primary">置顶</VanTag></span>
        {{ info.desc }}
      </div>
      <div class="content_attr" v-if="displayAttrs.length">
        <div class="attr-item" v-for="item in displayAttrs">
          <div class="name" >{{ item.name }}</div>
          <div class="val">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <!-- 产品分类展示 -->
    <template v-if="displayType">
      <div class="item-tit">产品分类</div>
      <div class="item-desc">{{ displayType }}</div>
    </template>

    <!-- 产品详情展示 -->
    <template v-if="descUrlDisplay.length">
      <div class="item-tit">产品详情</div>
      <div class="desc-img-wrap">
        <VanImage v-for="item in descUrlDisplay" :src="getImageUrl(item)" @click="showImagePreview([item])"/>
      </div>
    </template>
    
    <!-- <ModelDisplay ref="modelDisplayRef" :productInfo="info"/> -->
    <Setting :runtimeData="info" @update="init" />
    <DetialFooter :productInfo="info"/>
  </div>
  <div v-if="isShowEmpty" class="no-data-wrap">
    <VanEmpty description="暂无数据～" />
    <VanButton type="primary" block text="返回" @click="goback"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// import ModelDisplay from '@/components/model-display/index.vue'
import Setting from '@/components/setting/index.vue'
import { useProductDetial } from './hook'
import ImgSwipe from '@/components/img-swipe/index.vue'
import DetialFooter from './DetialFooter.vue'
import { getImageUrl } from '@/util'
import { showImagePreview } from 'vant';

const {
  info, imgList, init, shareHandle, displayAttrs, isShowSticky, specsDisplay, selectedSpecIdx,
  displayPrice, isShowDownTips, goback, isShowEmpty, isShowShare, isShowSpecImg, specItemClickHandle,
  viewSpecDetialHandle, descUrlDisplay, displayType
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
  padding-bottom: 100px;
  box-sizing: border-box;
  background: $bgWhite;
  .down-product-tips {
    position: fixed;
    background: rgba(0,0,0,.7);
    width: 100%;
    height: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    z-index: 10;
  }
  .swipe-wrap {
    position: relative;
    .see-3d {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  .content {
    padding: $pdM;
    // padding-bottom: 40px;
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
          word-break: break-all;
        }
      }
      .share {
        flex-shrink: 0;
      }
    }
    .content__specs {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      box-sizing: border-box;
      width: 100%;
      padding-top: 10px;
      .specs-left {
        flex: 1;
        position: relative;
        height: 28px;
        padding-bottom: 10px;
        .spec__content {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: auto;
          box-sizing: border-box;
          display: flex;
          flex-wrap: nowrap;
          padding: 0 10px 10px 0px;
          .spec-item {
            background: $bgGrey;
            padding: 0 12px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            border-radius: $bdrM;
            box-sizing: border-box;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            border: 1px solid $bgGrey;
            .van-image {
              width: 20px;
              height: 20px;
              margin-right: 5px;
              border-radius: 3px;
              overflow: hidden;
            }
            &.active {
              border-color: $themeColor;
              background: $bgWhite;
            }
          }
        }
      }
      .specs-right {
        margin-left: 10px;
        flex-shrink: 0;
        height: 28px;
        display: flex;
        align-items: center;
      }
    }
    .content__desc {
      margin-top: $mrM;
      white-space: pre-line;
      font-size: 16px;
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
  .item-tit {
    padding: $pdL $pdM;
    font-weight: bold;
  }
  .item-desc {
    padding: 0 $pdM;
    color: $grey8;
    margin-top: -5px;
    margin-bottom: 10px;
  }
  .desc-img-wrap {
    display: flex;
    flex-wrap: wrap;
    .van-image {
      width: 100%;
    }
  }
}
.action-price {
  color: $red;
}
.no-data-wrap {
  padding: 0 20px;
}

</style>


