<template>
  <div class="view-cus-inventory">
    <div class="filter-section">
      <div class="filter-item bd10">
        <div class="filter-label">时间范围:</div>
        <div class="filter-content">
          <DatePicker v-model="timeS" />
          <div class="time-range-line"> ～ </div>
          <DatePicker v-model="timeE" />
        </div>
      </div>
      <div class="col-2">
        <!-- 关键词 -->
        <div class="filter-item bd20">
          <div class="filter-content">
            <VanField
              v-model="keyword"
              placeholder="请输入清单号/关键词"
            />
          </div>
        </div>
        <!-- 清单状态 -->
        <div class="filter-item bd20">
          <div class="filter-label">清单状态:</div>
          <div class="filter-content">
            <Select
              v-model="active"
              :columns="tabOptions"
              v-model:show="showStatusSelect"
            />
            <div class="select-trigger" @click="showStatusSelect = true">
              {{ statusDisplay }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <div class="action-btn-wrap">
        <div class="content-left">
          <VanButton v-if="!isMulEdit" text="批量管理" type="default" size="small" @click="mulHandle" />
          <VanButton v-if="isMulEdit" text="退出管理" type="primary" size="small" @click="mulHandle" />
        </div>
        <div class="action-section">
          <VanButton text="重置" type="default" size="small" @click="resetHandle"/>
          <VanButton text="查询" type="primary" size="small" @click="searchHandle"/>
        </div>
      </div>
      <div class="mul-action-wrap" v-if="isMulEdit">
        <div class="mul-action-left">
          <div class="select-all" @click="selectAll = !selectAll">
            <VanCheckbox
              shape="square"
              :modelValue="selectAll"
            />
            <div>全选</div>
          </div>
          <div class="selected-nums">已选 {{ selectedItems.size }}/{{ dataList.length }} 项</div>
        </div>
        <div class="mul-action-right">
          <VanButton text="批量导出" size="mini" v-if="isShowBatchExport" @click="batchExportHandle"/>
          <VanButton text="批量完成" type="success" size="mini" v-if="isShowBatchFinish" @click="batchFinishHandle"/>
          <VanButton text="批量取消" type="warning" size="mini" v-if="isShowBatchCancel" @click="batchCancelHandle"/>
        </div>
      </div>
    </div>
    <div class="list-content">
      <div class="list-wrap" @scroll="scrollHandle" ref="listRef">
        <InventoryItem
          v-for="item in dataList"
          :data="item"
          :key="item.id"
          @cancel="cancelHandle"
          @finish="finishHandle"
          @select="handleItemSelect"
          @export="exportHandle"
          :isMul="isMulEdit"
          :selectedItems="selectedItems"
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
import Select from '@/components/select/index.vue'
import DatePicker from '@/components/date-picker/index.vue'

const {
  init, active, dataList, cancelHandle, finishHandle, scrollHandle, listRef, activeHandle, timeS,
  timeE, keyword, tabOptions,statusDisplay, showStatusSelect, searchHandle, resetHandle, isMulEdit,
  mulHandle, selectedItems, selectAll, handleItemSelect, isShowBatchFinish, isShowBatchCancel,
  batchFinishHandle, batchCancelHandle, batchExportHandle, isShowBatchExport, exportHandle
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
  padding-top: 10px;
  box-sizing: border-box;
  background: $bgWhite;
  .filter-section {
    flex-shrink: 0;
    background: $bgWhite;
    padding: 0 $pdM;
    box-sizing: border-box;
    .col-2 {
      display: flex;
      justify-content: space-between;
      .filter-item {
        width: 46%;
      }
    }
  }
  .filter-item {
    display: flex;
    align-items: center;
    padding: 3px 5px;
    justify-content: space-between;
    background: $bgGrey;
    margin-bottom: 8px;
    overflow: hidden;
    &.bd10 {
      border-radius: 10px;
    }
    &.bd20 {
      border-radius: 20px;
    }
    .filter-label {
      width: 75px;
      font-size: 14px;
      color: #333;
      font-weight: 500;
      text-align: right;
      flex-shrink: 0;
      padding-right: 10px;
      box-sizing: border-box;
    }
    .filter-content {
      display: flex;
      align-items: center;
      flex: 1;
      padding: 5px 0;
      overflow: hidden;
      :deep(.com-date-picker) {
        width: 100px;
        display: flex;
        justify-content: center;
      }
      :deep(.van-field) {
        padding: 0;
        background: inherit;
        .van-field__control {
          text-align: center;
        }
      }
    }
    .select-trigger {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 10px;
      background: #f5f5f5;
      border-radius: 6px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid #666;
      }
    }
  }
  .btn-wrap {
    flex-shrink: 0;
    background: $bgWhite;
    padding: 0 $pdM;
    border-bottom: 1px solid $bgGrey;
    padding-bottom: 10px;
    .action-btn-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mul-action-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      height: 24px;
      .mul-action-left {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        .select-all {
          display: flex;
          align-items: center;
          margin-right: 10px;
          .van-checkbox {
            margin-right: 5px;
          }
        }
        .selected-nums {
          font-size: 12px;
          color: $grey8;
        }
      }
      .mul-action-right {
        display: flex;
        align-items: center;
        :not(:first-child) {
          margin-left: 10px;
        }
        .van-button {
          flex-shrink: 0;
        }
      }
    }
    .content-left {
      width: 50%;
    }
    .action-section {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .van-button {
        min-width: 80px;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
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