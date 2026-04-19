<template>
  <div class="view-custom-home" @scroll="scrollHandle" ref="domRef">
    <div class="cfg-list-list">
      <template
        v-for="(item, index) in data.cfg"
        :key="index"
      >
        <template v-if="item.status === 1">
          <!-- 轮播图模块 -->
          <div v-if="item.comName === 'ItemBanner'" class="banner-wrap cfg-item">
            <ImgSwipeV2
              :mode="2"
              :list="getBannerList(item.info.url)"
              :scale="item.info.scale"
              :autoplay="item.info.autoPlay === 1 ? 3000 : 0"
              :width="375"
            />
          </div>
          <!-- 产品分类模块 -->
          <div v-if="item.comName === 'ItemProductType' && item.info.list && item.info.list.length" class="product-type-wrap cfg-item">
            <div
              class="type-grid"
              :class="{
                'type-grid-center': item.info.list && item.info.list.length === 1,
                'type-grid-2': item.info.list && item.info.list.length === 2,
                'type-grid-3': item.info.list && (item.info.list.length === 3 || item.info.list.length === 5 || item.info.list.length === 6),
                'type-grid-4': item.info.list && (item.info.list.length === 4 || item.info.list.length > 6)
              }"
            >
              <div
                class="type-item"
                v-for="(typeItem, typeIndex) in item.info.list"
                :key="typeIndex"
                @click="prodTypeClickHandle(typeItem)"
              >
                <div class="type-icon">
                  <VanImage v-if="typeItem.url" :src="getImageUrl(typeItem.url)" fit="cover" class="type-logo" />
                  <VanIcon v-else name="apps-o" class="type-default-icon" />
                </div>
                <div class="type-name">{{ getTypeName(typeItem.typeId) }}</div>
              </div>
            </div>
          </div>
          <!-- 自定义产品模块 -->
          <div v-if="item.comName === 'ItemCustomProduct' && data.customProducts && data.customProducts.length" class="custom-product-wrap cfg-item">
            <div class="tit-wrap">
              <div class="tit">精选推荐</div>
              <div class="view-more" @click="viewMoreProd">查看更多<VanIcon name="arrow" /></div>
            </div>
            <div class="prod-list">
              <div class="product-grid" v-for="(product, productIndex) in data.customProducts">
                <ProductItem
                  :key="product.id"
                  :data="product"
                  :shopInfo="shopInfo || {}"
                  :isShowSort="false"
                  :mode="productItemMode"
                />
              </div>
            </div>
          </div>
          <!-- 首页描述模块 -->
          <div v-if="item.comName === 'ItemHomeDesc'" class="home-desc-wrap cfg-item">
            <template v-if="getBannerList(item.info.url).length">
              <!-- <div class="item-tit">关于我们</div> -->
              <div class="desc-img-wrap">
                <VanImage
                  v-for="(img, imgIndex) in getBannerList(item.info.url)"
                  :key="imgIndex"
                  :src="getImageUrl(img)"
                  @click="showImagePreview([getImageUrl(img)])"
                />
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div v-if="data.cfg.length === 0 || data.cfg.filter(item => item.status === 1).length === 0" class="empty-wrap">
      <div class="empty-text">暂无首页配置</div>
    </div>
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'
import ProductItem from '@/components/product-item/index.vue'
import { useCustomHome } from './hook'
import { getImageUrl, emitter } from '@/util'
import { showImagePreview } from 'vant'

const {
  data, getBannerList, getTypeName, shopInfo, scrollHandle, activeHandle, domRef, viewMoreProd,
  prodTypeClickHandle, productItemMode, pageMode
} = useCustomHome()

onActivated(() => {
  activeHandle()
})

emitter.emit('registerGoTop', {listRef: domRef})

</script>

<script>
export default {
  name: 'CustomHome'
}
</script>

<style lang="scss" scoped>
.view-custom-home {
  background: $bgWhite;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding-bottom: $footerBarH;
  box-sizing: border-box;
  .cfg-list-list {

  }
  .banner-wrap {
    background: #fff;
    overflow: hidden;
  }
  .product-type-wrap {
    background: #fff;
    padding: 15px 10px 0 10px;
    .type-grid {
      display: flex;
      flex-wrap: wrap;
      .type-item {
        width: 33%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
        padding: 0 10px;
        box-sizing: border-box;
        .type-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: $bgGrey;
          .type-logo {
            width: 100%;
            height: 100%;
            border-radius: 8px;
            overflow: hidden;
          }
          .type-default-icon {
            font-size: 28px;
            color: $grey9;
          }
        }
        .type-name {
          margin-top: 8px;
          font-size: 13px;
          color: $grey6;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
      }
      // 1个分类时居中显示
      &.type-grid-center {
        justify-content: center;
        .type-item {
          width: auto;
        }
      }
      // 2个分类时一行显示2个
      &.type-grid-2 {
        .type-item {
          width: 50%;
        }
      }
      // 3个、5个、6个分类时一行显示3个
      &.type-grid-3 {
        .type-item {
          width: 33%;
        }
      }
      // 4个或超过6个分类时一行显示4个
      &.type-grid-4 {
        .type-item {
          width: 25%;
        }
      }
    }
  }
  .home-desc-wrap {
    background: #fff;
    .item-tit {
      padding: $pdL $pdM;
      font-weight: bold;
    }
    .desc-img-wrap {
      display: flex;
      flex-wrap: wrap;
      :deep(.van-image) {
        width: 100%;
      }
    }
  }
  .empty-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    .empty-text {
      color: $grey9;
      font-size: 14px;
    }
  }
  .custom-product-wrap {
    background: #fff;
    .tit-wrap {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px 12px 10px;
      .view-more {
        color: $grey8;
      }
    }
    .tit {
      font-weight: bold;
    }
    .prod-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 5px;
    }
    .product-grid {
      width: 50%;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

</style>
