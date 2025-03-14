
<template>
  <div class="view-type-manage">
    <div class="tit">分类列表</div>
    <VanCollapse v-model="activeNames">
      <TypeContentWrap v-for="item in displayTypes" :key="item.id" @setClick="settingClickHandle(item)">
        <VanCollapseItem v-if="isShowColl(item)" :title="item.name" :name="item.id">
          <TypeContentWrap v-for="subItem in getSubTypes(item)" @setClick="settingClickHandle(subItem)">
            <VanCell :title="subItem.name"/>
          </TypeContentWrap>
        </VanCollapseItem>
        <VanCell v-else :title="item.name"/>
      </TypeContentWrap>
    </VanCollapse>
    <div class="bottom-btn">
      <VanButton text="新增一级分类" block type="primary" native-type="submit" @click="addHandle"/>
    </div>
    <ProductTypeDialog ref="dialogEditRef"/>
    <VanActionSheet
      :actions="actions"
      v-model:show="showAction"
      @select="selectHandle"
      close-on-click-action
      cancel-text="取消"
    />
  </div>
  <DialogSort ref="dialogSortRef"/>
</template>

<script setup>
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import { useTypeManage } from './hook'
import TypeContentWrap from './TypeContentWrap.vue'
import DialogSort from './DialogSort.vue'

const {
  displayTypes,
  dialogEditRef,
  addHandle,
  actions,
  showAction,
  selectHandle,
  settingClickHandle,
  isShowColl,
  activeNames,
  getSubTypes,
  dialogSortRef
} = useTypeManage()


</script>

<style lang="scss" scoped>
.view-type-manage {
  background: $bgWhite;
  min-height: 100%;
  padding-bottom: $footerBarH;
  box-sizing: border-box;
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
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    height: $footerBarH;
    display: flex;
    // align-items: center;
    padding-top: 10px;
  }
}

</style>