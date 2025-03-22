<template>
  <div class="view-cus-inventory">
    <div class="header-content">
      <VanTabs v-model:active="active" @change="tabChangeHandle">
        <VanTab title="全部"></VanTab>
        <VanTab title="待处理"></VanTab>
        <VanTab title="已完成"></VanTab>
        <VanTab title="已取消"></VanTab>
      </VanTabs>
    </div>
    <div class="mul-handle" v-if="isShowMulHandle">
      <VanButton text="全部取消" type="warning" size="small" @click="cancelAllHandle" />
      <VanButton text="全部完成" type="primary" size="small" @click="finishAllHandle" />
    </div>
    <div class="list-content">
      <div class="list-wrap" @scroll="scrollHandle" ref="listRef">
        <InventoryItem
          v-for="item in dataList"
          :data="item"
          :key="item.id"
          @cancel="cancelHandle"
          @finish="finishHandle"
        />
        <div class="done">到底啦～</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onActivated } from 'vue'
import { useCusInventory } from './hook'
import InventoryItem from './InventoryItem.vue'

const {
  init, active, dataList, cancelHandle, finishHandle, tabChangeHandle, scrollHandle,
  listRef, activeHandle, isShowMulHandle, cancelAllHandle, finishAllHandle
} = useCusInventory()

init()

onActivated(activeHandle)


</script>

<script>
export default {
  name: 'CusInventory'
}
</script>

<style scoped lang="scss">
.view-cus-inventory {
  display: flex;
  flex-direction: column;
  height: 100%;
  .mul-handle {
    display: flex;
    justify-content: flex-end;
    background: $bgWhite;
    padding: 10px $pdM;
    border-bottom: 1px solid $bgGrey;
    .van-button {
      margin-left: 10px;
    }
  }
  .header-content {
    flex-shrink: 0;
    border-bottom: 1px solid $bgGrey;
  }
  .list-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    .list-wrap {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;
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
</style>