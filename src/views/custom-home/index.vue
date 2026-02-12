<template>
  <div class="view-custom-home">
    <div class="cfg-list-list">
      <div
        class="cfg-item"
        v-for="(item, index) in data.cfg"
        :key="index"
        v-show="item.status === 1"
      >
        <!-- 轮播图模块 -->
        <div v-if="item.comName === 'ItemBanner'" class="banner-wrap">
          <ImgSwipe
            :mode="2"
            :list="getBannerList(item.info.url)"
            :scale="item.info.scale"
            :autoplay="item.info.autoPlay === 1 ? 3000 : 0"
            :width="375"
          />
        </div>
        <!-- 产品分类模块 -->
        <div v-if="item.comName === 'ItemProductType'" class="product-type-wrap">
          <div class="type-grid">
            <div
              class="type-item"
              v-for="(typeItem, typeIndex) in item.info.list"
              :key="typeIndex"
            >
              <div class="type-icon">
                <VanImage v-if="typeItem.url" :src="getImageUrl(typeItem.url)" fit="cover" class="type-logo" />
                <VanIcon v-else name="apps-o" class="type-default-icon" />
              </div>
              <div class="type-name">{{ getTypeName(typeItem.typeId) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="data.cfg.length === 0 || data.cfg.filter(item => item.status === 1).length === 0" class="empty-wrap">
      <div class="empty-text">暂无首页配置</div>
    </div>
  </div>
</template>

<script setup>
import ImgSwipe from '@/components/img-swipe/index.vue'
import { useCustomHome } from './hook'
import { getImageUrl } from '@/util'

const {
  data, getBannerList, getTypeName
} = useCustomHome()

</script>

<style lang="scss" scoped>
.view-custom-home {
  background: $bgWhite;
  min-height: 100%;
  .cfg-list-list {
    .cfg-item:not(:first-child) {
      margin-top: 10px;
    }
  }
  .banner-wrap {
    background: #fff;
    overflow: hidden;
  }
  .product-type-wrap {
    background: #fff;
    padding: 15px 10px;
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
}

</style>
