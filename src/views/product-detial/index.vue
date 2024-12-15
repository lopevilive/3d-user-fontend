<template>
  <div class="view-product-detial" v-if="info.id">
    <div class="swipe-wrap">
      <ImgSwipe :list="imgList" />
      <VanButton v-if="[1,2].includes(info.type3D)" class="see-3d" icon="eye-o" text="720°全景图" size="mini" @click="handleView3D"/>
    </div>
    <div class="content">
      <div class="content__head">
        <div class="price">
          <template  v-if="displayPrice">
            <span class="unit">¥</span>
            <span class="num">{{ displayPrice }}</span>
          </template>
        </div>
        <div class="share">
          <VanButton @click="shareHandle" size="small" icon="share-o" icon-position="right">分享</VanButton>
        </div>
      </div>
      <div class="content__specs" v-if="info.isSpec === 1">
        <div class="specs-left">
          <div class="spec__content">
            <div
              class="spec-item"
              :class="{active: index === selectedSpecIdx}"
              v-for="(item, index) in specsDisplay"
              :key="item.name"
              @click="selectedSpecIdx = index"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <div @click="isShowAction=true" class="specs-right">{{specsDisplay.length}}款可选<VanIcon name="arrow"/></div>
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
    <ModelDisplay ref="modelDisplayRef" :productInfo="info"/>
    <Setting :runtimeData="info" @update="init" />
    <VanActionSheet
      v-model:show="isShowAction"
      cancel-text="取消"
      teleport="body"
    >
      <VanButton
        v-for="(actionItem, index) in specsDisplay"
        class="van-action-sheet__item"
        @click="selectHandle(actionItem, index)"
      >
        {{ actionItem.name }} &nbsp;&nbsp;<span class="action-price">¥{{ actionItem.price }}</span>
      </VanButton>
    </VanActionSheet>
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
  handleView3D,
  init,
  modelDisplayRef,
  shareHandle,
  displayAttrs,
  isShowSticky,
  specsDisplay,
  selectedSpecIdx,
  displayPrice,
  isShowAction,
  selectHandle
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
          padding-bottom: 10px;
          .spec-item {
            background: #f5f6f8;
            padding: 0 12px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            border-radius: $bdrM;
            box-sizing: border-box;
            flex-shrink: 0;
            &.active {
              border: 1px solid $themeColor;
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
}
.action-price {
  color: $red;
}

</style>


