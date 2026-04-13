<template>
  <div class="view-staff-manage">
    <div class="header">
      <van-tabs v-model:active="activeTab" @change="tabChangeHandle">
        <van-tab title="管理员列表" :name="1" />
        <!-- <van-tab title="分销员列表" :name="2" /> -->
      </van-tabs>
      <div class="role-tips">
        <van-icon name="info-o" />
        <span v-if="activeTab === 1">管理员：可管理产品及分类，拥有全部操作权限</span>
        <span v-if="activeTab === 2">分销员：不受“隐藏价格”及“分享限制”影响，可看价并转发</span>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content">
        <VanEmpty v-if="dataList.length == 0 && invalidList.length === 0" description="暂无数据~"/>
        <VanList :finished="true" class="content-list">
          <VanCell v-for="item in dataList" :key="item.id">
            <template #title>
              <div class="tit">
                <div>{{ item.nickName }}</div>
                <VanTag type="primary" plain v-if="item.status === 1">待接受</VanTag>
              </div>
            </template>
            <template #value>
              <div class="opt">
                <VanButton v-if="item.status === 1" @click="toInvite(item)" text="去邀请" size="small" type="primary"/>
                <VanIcon name="setting-o" @click="settingClickHandle(item)"/>
              </div>
            </template>
          </VanCell>
        </VanList>
        <!-- 失效人员 -->
        <VanCollapse v-model="activeNames" v-if="invalidList.length">
          <VanCollapseItem :name="1">
            <template #title>
              <div class="invalid-wrap">
                <div>失效人员列表</div>
                <VanButton v-if="activeNames.length" text="全部删除" size="mini" type="danger" @click="delAllHandle" />
              </div>
            </template>
            <template #default>
              <VanList :finished="true" class="content-list invalid-list">
                <VanCell v-for="item in invalidList" :key="item.id">
                  <template #title>
                    <div class="tit">
                      <div class="name">{{ item.nickName }}</div>
                      <VanTag type="warning" plain v-if="item.status === 2">对方已拒绝</VanTag>
                      <VanTag type="warning" plain v-if="item.status === 3">邀请过期</VanTag>
                    </div>
                  </template>
                </VanCell>
              </VanList>
            </template>
          </VanCollapseItem>
        </VanCollapse>
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
    <DialogStaff ref="dialogStaffRef" @update="handleUpdate" :type="activeTab"/>
  </div>
</template>

<script setup>
import { useStaffManage } from './hook'
import DialogStaff from './DialogStaff.vue'

const {
  activeTab, init, tabChangeHandle, dataList, settingClickHandle, actions, showAction, selectHandle, typeName,
  addHandle, dialogStaffRef, activeNames, invalidList, delAllHandle, handleUpdate, toInvite
} = useStaffManage()

init()


</script>

<style scoped lang="scss">
.view-staff-manage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    background: #fff;
    
    .role-tips {
      padding: 10px 16px;
      font-size: 12px;
      color: #ed6a0c; // 警告橘色，或者用 $grey8
      background-color: #fffbe8; // 浅黄色背景，增加引导感
      display: flex;
      align-items: center;
      
      .van-icon {
        margin-right: 6px;
        font-size: 14px;
      }
    }
  }
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
      .bottom-btn {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: $footerBarH;
        padding: 0 $pdH;
        box-sizing: border-box;
        background: $bgWhite;
        display: flex;
        // align-items: center;
        padding-top: 8px;
      }
      .invalid-wrap {
        color: $greyPlaceholder;
        display: flex;
        align-items: center;
        :deep(.van-button) {
          margin-left: $mrL;
        }
      }
    }
  }
  .content-list {
    .tit {
      display: flex;
      align-items: center;
      height: 100%;
      :deep(.van-tag) {
        margin-left: $mrL;
      }
    }
    .opt {
      display: flex;      
      align-items: center;
      justify-content: flex-end;
      :deep(.van-icon) {
        padding: 5px;
        font-size: 24px;
        margin-left: $mrM;
      }


    }
  }
  :deep(.van-collapse) {
    margin-top: 10px;
  }
  .invalid-list {
    .tit {
      color: $grey8;
    }
  }
}


</style>