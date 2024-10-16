
<template>
  <div class="view-type-manage">
    <div class="tit">分类列表</div>
    <VanList :finished="true">
      <VanCell v-for="item in data" :key="item.id" :title="item.name">
         <div class="opt">
          <VanIcon name="setting-o" @click="settingClickHandle(item)"/>
        </div>
      </VanCell>
    </VanList>
    <div class="bottom-btn">
      <VanButton text="新增分类" block type="primary" native-type="submit" @click="addHandle"/>
    </div>
    <ProductTypeDialog ref="dialogEditRef" @update="init"/>
    <VanActionSheet
      :actions="actions"
      v-model:show="showAction"
      @select="selectHandle"
      close-on-click-action
      cancel-text="取消"
    />
  </div>
</template>

<script setup>
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import { useTypeManage } from './hook'

const {
  data,
  dialogEditRef,
  init,
  addHandle,
  actions,
  showAction,
  selectHandle,
  settingClickHandle
} = useTypeManage()

init()

</script>

<style lang="scss" scoped>
.view-type-manage {
  background: $bgWhite;
  min-height: 100%;
  .tit {
    padding:$pdH $pdM 0 $pdM;
    color: #528cb1;
  }
  .opt {
    font-size: 24px;
    :deep(.van-icon) {
      padding: 5px;
    }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: $pdH;
    box-sizing: border-box;
    background: $bgWhite;
  }
}

</style>