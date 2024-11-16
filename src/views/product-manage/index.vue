<template>
  <div class="com-product-manage">
    <div>
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
          <div class=main-btn @click="handleEditDone">退出管理</div>
        </div>
        <div class="edit__bottom">
          <VanButton text="批量上架" size="small" type="success" :disabled="selectedList.length === 0" @click="handleMulOnOff('on')" v-if="activeTab === -2" />
          <VanButton text="批量下架" size="small" type="warning" :disabled="selectedList.length === 0" @click="handleMulOnOff('off')" v-else/>
          <VanButton text="批量删除" size="small" type="danger" :disabled="selectedList.length === 0" @click="handleMulDel" />
          <VanButton text="批量改价" size="small" type="primary" :disabled="selectedList.length === 0" @click="handleMulPrice" />
          <VanButton text="批量分类" size="small" type="primary" :disabled="selectedList.length === 0" @click="handleMulChangeType" />
        </div>
      </div>
      <div class="tabs">
        <VanTabs v-model:active="activeTab" @change="tabChangeHandle">
          <VanTab v-for="item in productTypes" :key="item.id" :title="item.name" :name="item.id"></VanTab>
        </VanTabs>
      </div>
    </div>
    <div class="product-content">
      <div class="wrap">
        <div class="list" @scroll="scrollHandle">
            <div ref="leftListRef" class="left-list list-item">
              <productItem v-for="item in leftList" :data="item" :key="item.id" @update="activedHandle" @selected="selectedHandle" />
            </div>
            <div ref="rightListRef" class="right-list list-item">
              <productItem v-for="item in rightList" :data="item" :key="item.id" @update="activedHandle" @selected="selectedHandle" />
            </div>
            <div v-if="fetchLoading" class="loading"><VanLoading /></div>
            <div v-if="finished" class="done">到底啦～</div>
        </div>
      </div>
    </div>
    <Setting />
    <MulPrice ref="mulPriceRef"/>
    <MulProductType ref="mulProductTypeRef" />
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import Setting from '@/components/setting/index.vue'
import productItem from './ProductItem.vue'
import {useProductManage} from './hook'
import { globalData } from '@/store'
import MulPrice from './MulPrice.vue'
import MulProductType from './MulProductType.vue'

const {
  init,
  activeTab,
  productTypes,
  activedHandle,
  tabChangeHandle,
  leftList,
  rightList,
  leftListRef,
  rightListRef,
  scrollHandle,
  finished,
  fetchLoading,
  selectedList,
  selectedHandle,
  removeAllSelected,
  handleEditDone,
  addProdHandle,
  handleMulOnOff,
  handleMulDel,
  handleMulPrice,
  handleMulChangeType,
  mulPriceRef,
  mulProductTypeRef
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
      padding: 5px 20px;
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
  .tabs{
    padding: 0 $pdM $pdL $pdM;
    background: $bgWhite;
    // margin-top: $mrL;
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
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    margin-bottom: $footerBarH;
    .wrap {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .list {
      position: absolute;
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
        line-height: 50px;
      }
    }
  }
}

</style>