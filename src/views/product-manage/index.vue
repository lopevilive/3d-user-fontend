<template>
  <div class="com-product-manage">
    <div>
      <div class="header">
        <div class="name">{{ shopInfo.name }}</div>
        <!-- <div class="search"></div> -->
      </div>
      <div class="tabs">
        <!-- 切换太快导致bug，上一个请求的数据覆盖下一个 todo -->
        <VanTabs v-model:active="activeTab" @change="tabChangeHandle">
          <VanTab v-for="item in productTypes" :key="item.id" :title="item.name"></VanTab>
        </VanTabs>
      </div>
    </div>
    <div class="product-content">
      <div class="wrap">
        <div class="list">
          <VanList
            @load="loadHandle"
            :offset="-150"
            :immediate-check="false"
            :finished="finished"
            v-model:loading="fetchLoading"
            finished-text="没有更多了"
          >
            <productItem v-for="item in prodcutList" :data="item" :key="item.id" @update="activedHandle"/>
          </VanList>
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
  prodcutList,
  loadHandle,
  finished,
  fetchLoading,
  activedHandle,
  tabChangeHandle
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
        width: 6px;
        height: 6px;
        background: #000;
        border-radius: 50%;
        opacity: 0.7;
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
      :deep(.van-list) {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content:space-between;
        align-items:flex-start;
      }
      :deep(.van-list__loading) {
        width: 100%;
      }
      :deep(.van-list__finished-text) {
        width: 100%;
      }
    }
  }
}

</style>