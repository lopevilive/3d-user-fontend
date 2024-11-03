<template>
  <div class="view-staff-manage">
    <div class="header">
      <van-tabs v-model:active="activeTab">
        <van-tab title="管理员" />
        <van-tab title="分销员" />
      </van-tabs>
    </div>
    <div class="content-wrap">
      <div class="content">
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStaffManage } from './hook'

const {activeTab} = useStaffManage

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
    .content {
      position: absolute;
      left: 0;
      top: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}


</style>