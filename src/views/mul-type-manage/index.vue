<template>
  <div class="view-mul-type-manage">
    <div class="mul-type-list">
      <div class="type-item" v-for="(item, idx) in list">
        <ProdTypeSelect :mode="1" v-model="item.val"  @del="delHandle(idx)" :showDel="true">
          <template #label>
            {{ idx+1 }}.分类
          </template>
        </ProdTypeSelect>
      </div>
    </div>
    <div class="add-btn">
      <VanButton block text="添加" icon="plus" @click="addHandle"/>
    </div>
    <div class="bottom-btn">
      <VanButton text="取消" block @click="cancelHandle"/>
      <VanButton text="保存" @click="saveHandle" block type="primary" />
    </div>
  </div>
</template>


<script setup>
import { onUnmounted } from 'vue'
import { useMulTypeManage } from './hook'
import ProdTypeSelect from '@/components/prod-type-select/index.vue'

const {
  beforeDestory, cancelHandle, saveHandle, init, list, addHandle, delHandle
} = useMulTypeManage()

onUnmounted(beforeDestory)

init()


</script>

<style lang="scss" scoped>
.view-mul-type-manage {
  padding-bottom: $footerBarH;
  box-sizing: border-box;
  background: $bgWhite;
  min-height: 100%;
  .mul-type-list {
    padding: $pdH;
    box-sizing: border-box;
    .type-item {
      border: 1px solid $bgGrey;
      box-sizing: border-box;
      // padding: $pdM;
      margin-bottom: 10px;
    }
  }
  .add-btn {
    padding: 0 20px;
    margin-bottom: 20px; 
  }
  .bottom-btn {
    z-index: 10;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    height: $footerBarH;
    display: flex;
    padding-top: 10px;
    border-top: 1px solid $bgGrey3;
    :deep(.van-button) {
      margin: 0 10px;
    }
  }
}


</style>