<template>
  <div class="com-product-manage">
    <div>
      <div class="header">
        <div class="name">{{ shopInfo.name }}</div>
        <!-- <div class="search"></div> -->
      </div>
      <div class="tabs">
        <VanTabs v-model:active="activeTab" @change="tabChangeHandle">
          <VanTab v-for="item in productTypes" :key="item.id" :title="item.name" :name="item.id"></VanTab>
        </VanTabs>
      </div>
    </div>
    <div class="product-content">
      <div class="wrap">
        <div class="list" ref="listRef" @scroll="scrollHandle">
            <div ref="leftListRef" class="left-list list-item">
              <productItem v-for="item in leftList" :data="item" :key="item.id" @update="activedHandle"/>
            </div>
            <div ref="rightListRef" class="right-list list-item">
              <productItem v-for="item in rightList" :data="item" :key="item.id" @update="activedHandle"/>
            </div>
            <div v-if="fetchLoading" class="loading"><VanLoading /></div>
            <div v-if="finished" class="done">到底啦～</div>
        </div>
      </div>
    </div>
    <Setting />
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import Setting from '@/components/setting/index.vue'
import productItem from './ProductItem.vue'
import {useProductManage} from './hook'

const {
  init,
  shopInfo,
  activeTab,
  productTypes,
  activedHandle,
  tabChangeHandle,
  leftList,
  rightList,
  leftListRef,
  rightListRef,
  listRef,
  scrollHandle,
  finished,
  fetchLoading
} = useProductManage()

onActivated(activedHandle)

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
  .header {
    background: $bgWhite;
    height: 60px;
    .name {
      display: flex;
      justify-content: center;
      font-size: $fsB;
      padding: $pdH;
      position: relative;
    }
  }
  .tabs{
    padding: 0 $pdM;
    background: $bgWhite;
    margin-top: $mrL;
    :deep(.van-tabs__nav) {
      .van-tabs__line {
        background: #ec6443;
        width: 20px;
        height: 4px;
      }
    }
  }
  .product-content {
    flex: 1;
    background: $bgWhite;
    padding: $pdL;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .wrap {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .list {
      position: absolute;
      // padding-bottom: 50px;
      box-sizing: border-box;
      width: 100%;
      max-height: 100%;
      overflow: auto;
      padding: $pdL;
      display: flex;
      flex-wrap: wrap;
      justify-content:space-between;
      align-items:flex-start;
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
      }
    }
  }
}

</style>