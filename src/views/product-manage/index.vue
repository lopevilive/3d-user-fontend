<template>
  <div class="com-product-manage">
    <div class="header-wrap">
      <div class="mode__edit"  v-if="globalData.editStatus === 1">
        <div class="edit-left">
          <VanButton text="新增产品" size="small" type="primary" :round="true" icon="plus" @click="addProdHandle"/>
          <VanButton
            text="取消选择"
            size="small"
            :round="true"
            type="primary"
            plain
            :disabled="selectedList.length === 0"
            @click="removeAllSelected"
          />
        </div>
        <div class="edit-right">
          <div class="main-btn" @click="handleEditDone">退出管理</div>
        </div>
        <div class="edit__bottom">
          <VanButton text="批量上架" size="small" type="success" :disabled="selectedList.length === 0" @click="handleMulOnOff('on')" v-if="activeTab === -2" />
          <VanButton text="批量下架" size="small" type="warning" :disabled="selectedList.length === 0" @click="handleMulOnOff('off')" v-else/>
          <VanButton text="批量删除" size="small" type="danger" :disabled="selectedList.length === 0" @click="handleMulDel" />
          <VanButton text="批量改价" size="small" type="primary" :disabled="selectedList.length === 0" @click="handleMulPrice" />
          <VanButton text="批量分类" size="small" type="primary" :disabled="selectedList.length === 0" @click="handleMulChangeType" />
        </div>
      </div>
    </div>
    <div class="product-content">
      <div class="left-wrap" v-if="typeMod === 1">
        <LeftTypeMod 
          :productTypes="productTypes" :subTypesList="subTypesList"
          v-model:activeTab="activeTab"
          @type1Change="tabChangeHandle"
          :subActiveTab="subActiveTab"
          @type2Change="beforeSubChange"
        />
      </div>
      <div class="wrap">
        <div class="list" @scroll="scrollHandle" ref="listRef">
          <ImgSwipe
            v-if="isShowBanner" :mode="2" :list="bannerCfg.imgList" :scale="bannerCfg.scale"
            :autoplay="3000" :width="typeMod === 1 ? 285 : 375"
            :key="bannerKey"
          />
          <VanSticky :offset-top="stickyPos" class="sticky-wrap">
            <div class="flexible__content">
              <form action="none" class="content-form" :class="{'pd-10': typeMod === 1}">
                <VanSearch
                  show-action
                  placeholder="请输入搜索关键词"
                  v-model="searchStr"
                  @blur="searchBlurHadle"
                  @cancel="searchBlurHadle"
                />
                <SortControl name="价格" v-model="priceSort" @change="priceSortChangeHandle"/>
              </form>
            </div>
            <div class="tabs" v-if="typeMod === 0">
              <div class="tabs__left">
                <VanTabs v-model:active="activeTab" @change="tabChangeHandle" :shrink="true" :key="tabKey">
                  <VanTab v-for="item in productTypes" :key="item.id" :title="item.name" :name="item.id"></VanTab>
                </VanTabs>
              </div>
              <div class="tabs__right">
                <VanIcon @click="type1PopClickHandle" name="bars" class="bar-icon" v-if="productTypes.length > 5" />
                <!-- <SortControl name="价格" v-model="priceSort" @change="priceSortChangeHandle"/> -->
              </div>
            </div>
            <div class="sub-tabs" v-if="subTypesList.length && typeMod === 0">
              <div class="sub-tabs__left">
                <VanTabs v-model:active="subActiveTab" :shrink="true" :before-change="beforeSubChange">
                  <VanTab v-for="item in subTypesList" :key="item.id" :title="item.name" :name="item.id"></VanTab>
                </VanTabs>
              </div>
              <div class="sub-tabs_right">
                <VanIcon @click="type2PopClickHandle" name="bars" class="bar-icon" v-if="subTypesList.length > 5" />
              </div>
            </div>
          </VanSticky>
          <div ref="leftListRef" class="left-list list-item">
            <productItem v-for="item in leftList" :data="item" :key="item.id"
              @update="handleUpdate" @selected="selectedHandle" :productType="formatType()"
              :isShowSort="isShowSort" :shopInfo="shopInfo"
            />
          </div>
          <div ref="rightListRef" class="right-list list-item">
            <productItem v-for="item in rightList" :data="item" :key="item.id"
              @update="handleUpdate" @selected="selectedHandle" :productType="formatType()"
              :isShowSort="isShowSort" :shopInfo="shopInfo"
            />
          </div>
          <div v-if="fetchLoading" class="loading"><VanLoading /></div>
          <div v-if="finished" class="done">到底啦～</div>
        </div>
      </div>
    </div>
    <Setting />
    <ProductPriceDialog ref="mulPriceRef" title="批量改价" />
    <TypeSelectDialog ref="mulProductTypeRef" />
    <ShareFloat />
    <GoTop :listRef="listRef" :scrollT="scrollT" />
    <TypePop ref="type1PopRef" :productTypes="productTypes" :activeId="activeTab" />
    <TypePop ref="type2PopRef" :productTypes="subTypesList" :activeId="subActiveTab" />
    <ExpiredTips />
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import Setting from '@/components/setting/index.vue'
import productItem from '@/components/product-item/index.vue'
import {useProductManage} from './hook'
import { globalData } from '@/store'
import TypeSelectDialog from '@/components/type-select-dialog/index.vue'
import ShareFloat from './ShareFloat.vue'
import GoTop from './GoTop.vue'
import ProductPriceDialog from '@/components/product-price-dialog/index.vue'
import SortControl from '@/components/sort-control/index.vue'
import ImgSwipe from '@/components/img-swipe/index.vue'
import TypePop from './TypePop.vue'
import LeftTypeMod from './LeftTypeMod.vue'
import ExpiredTips from './ExpiredTips.vue'

const {
  init, activeTab, productTypes, tabChangeHandle, leftList, rightList, leftListRef,
  rightListRef, scrollHandle, finished, fetchLoading, selectedList, selectedHandle,
  removeAllSelected, handleEditDone, addProdHandle, handleMulOnOff, handleMulDel,
  handleMulPrice, handleMulChangeType, mulPriceRef, mulProductTypeRef, listRef, bannerCfg,
  handleUpdate, tabKey, activeHandle, searchStr, searchBlurHadle, scrollT, stickyPos, bannerKey, 
  priceSort, priceSortChangeHandle, subTypesList, subActiveTab, beforeSubChange, formatType, isShowSort,
  shopInfo, isShowBanner, type1PopRef, type1PopClickHandle, type2PopRef, type2PopClickHandle, typeMod
} = useProductManage()

onActivated(() => {
  activeHandle()
})

init()

</script>

<script>
export default {
  name: 'ProductManage'
}
</script>

<style lang="scss" scoped>
.com-product-manage {
  height: 100%;
  background: $bgGrey;
  display: flex;
  flex-direction: column;
  .mode__edit {
    background: $bgWhite;
    display: flex;
    justify-content: space-between;
    height: 50px;
    padding: 0 $pdM;
    border-bottom: 1px solid #e3e3e3;
    .main-btn {
      background: #7e7e80;
      border-radius: 40px;
      padding: 8px 20px;
      font-weight: bold;
      font-size: 12px;
    }
    .edit-left,.edit-right {
      display: flex;
      align-items: center;
      
    }
    :deep(.van-button) {
      margin-right: $mrL;
    }
    .edit__bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      height: $footerBarH;
      background: $bgWhite;
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0 $pdH;
      box-sizing: border-box;
      padding-top: 8px;
      border-top: 1px solid #e3e3e3;
      :deep(.van-button) {
        margin-right: 0;
      }
    }
  }
  .bar-icon {
    font-size: 20px;
    padding-right: 5px;
    margin-right: 3px;
    color: $themeColor;
  }
  .tabs{
    padding: 0 $pdM $pdL $pdM;
    background: $bgWhite;
    display: flex;
    align-items: center;
    .tabs__left {
      flex: 1;
      overflow: auto;
    }
    .tabs__right {
      flex-shrink: 0;
      padding-left: 10px;
      display: flex;
      align-items: center;
    }
    :deep(.van-tabs__wrap) {
      height: 36px;
      .van-tabs__nav {
        // padding-bottom: 10px;
        padding-bottom: 0;
        .van-tabs__line {
          background: $themeColor;
          width: 20px;
          height: 4px;
          bottom: 0;
        }
      }
    }
  }
  .sub-tabs {
    padding: 0 $pdM $pdL $pdM;
    background: $bgWhite;
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    .sub-tabs__left{
      flex: 1;
      overflow: auto;
      box-sizing: border-box;
    }
    .sub-tabs_right {
      padding-left: 10px;
    }
    :deep(.van-tabs__wrap) {
      height: 20px;
      .van-tabs__nav {
        padding-bottom: 0;
        .van-tabs__line {
          display: none;
        }
      }
      .van-tab--active {
        background: $themeColor;
        color: #fff;
        border-radius: 5px;
        font-weight: normal;
      }
      .van-tabs__nav {
        .van-tab:first-child{
          display: none;
        }
      }
    }
  }
  .product-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    margin-bottom: $footerBarH;
    display: flex;
    .left-wrap {
      width: 90px;
      flex-shrink: 0;
      height: 100%;
      overflow: auto;
      background: $bgWhite;
      padding-top: 5px;
      box-sizing: border-box;
    }
    .wrap {
      // width: 100%;
      // height: 100%;
      position: relative;
      flex-shrink: 0;
      flex: 1;
    }
    .sticky-wrap {
      width: 100%;
      .flexible__content {
        .content-form {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 10px 0 5px;
          background-color: $bgWhite;
        }
        .pd-10 {
          padding-bottom: 10px;
        }
        :deep(.van-search) {
          padding: 0;
          flex: 1;
        }
      }
    }
    .list {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      max-height: 100%;
      overflow: auto;
      // padding: 4px;
      display: flex;
      flex-wrap: wrap;
      justify-content:space-between;
      align-items:flex-start;
      .left-list {
        padding-left: 4px;
        box-sizing: border-box;
      }
      .right-list {
        padding-right: 4px;;
        box-sizing: border-box;
      }
      .list-item {
        width: 50%;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      .loading {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .done {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $greyPlaceholder;
        line-height: 50px;
      }
    }
  }
}

</style>