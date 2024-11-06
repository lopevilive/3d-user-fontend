<template>
  <div class="view-staff-manage">
    <div class="header">
      <van-tabs v-model:active="activeTab" @change="tabChangeHandle">
        <van-tab title="管理员" :name="1" />
        <!-- <van-tab title="分销员" :name="2" /> -->
      </van-tabs>
    </div>
    <div class="content-wrap">
      <div class="content">
        <VanList :finished="true">
          <VanCell v-for="item in dataList" :key="item.id" :title="item.nickName">
            <div class="opt">
              <VanIcon name="setting-o" @click="settingClickHandle(item)"/>
            </div>
          </VanCell>
        </VanList>
        <div class="bottom-btn">
          <VanButton :text="`新增${typeName}`" block type="primary" native-type="submit" @click="addHandle"/>
        </div>
      </div>
    </div>
    <VanActionSheet
      :actions="actions"
      v-model:show="showAction"
      @select="selectHandle"
      close-on-click-action
      cancel-text="取消"
    />
    <DialogStaff ref="dialogStaffRef"/>
  </div>
</template>

<script setup>
import { useStaffManage } from './hook'
import DialogStaff from './DialogStaff.vue'

const {
  activeTab,
  init,
  tabChangeHandle,
  dataList,
  settingClickHandle,
  actions,
  showAction,
  selectHandle,
  typeName,
  addHandle,
  dialogStaffRef
} = useStaffManage()

init()


</script>

<style scoped lang="scss">
.view-staff-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-wrap {
    flex: 1;
    flex-shrink: 0;
    position: relative;
    margin-top: 2px;
    .content {
      position: absolute;
      left: 0;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: 100%;
      padding-bottom: $footerBarH;
      box-sizing: border-box;
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
        height: $footerBarH;
        padding: 0 $pdH;
        box-sizing: border-box;
        background: $bgWhite;
        display: flex;
        align-items: center;
      }
    }
  }
}


</style>