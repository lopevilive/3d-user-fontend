<template>
  <VanDialog 
    v-model:show="visible" 
    title="内部备注"
    class="com-key-value-dialog com-kv-dialog--minimal"
    confirm-button-text="关闭"
  >
    <div class="dialog-content">
      <div v-if="localList.length > 0" class="kv-list">
        <div v-for="(item, index) in localList" :key="index" class="kv-item">
          <span class="label">{{ item.key }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
      <VanEmpty v-else description="无私有数据" image-size="50" />
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const visible = ref(false);
const localList = ref([]);

const show = (list) => {
  if (!list) {
    localList.value = [];
  } else if (typeof list === 'string') {
    try {
      localList.value = JSON.parse(list);
    } catch (e) {
      localList.value = [];
    }
  } else {
    localList.value = list;
  }
  
  visible.value = true;
};

defineExpose({ show });
</script>

<style scoped lang="scss">
.com-key-value-dialog {
  :deep(.van-dialog__header) {
    padding-bottom: 5px; // 为内容腾出空间
  }
  
  .dialog-content {
    max-height: 50vh;
    overflow-y: auto;
    padding: $pdM $pdM; // 调整内边距

    .kv-item {
      display: flex;
      justify-content: space-between; // 核心：两端对齐
      align-items: center;
      border-bottom: 1px dashed #dcdee0; // 使用虚线更显轻盈
      padding: 5px 0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 14px;
        color: #646566; 
        max-width: 45%; // 限制 Key 宽度
        // white-space: nowrap; // Key 不换行
        // overflow: hidden;
        // text-overflow: ellipsis;
      }

      .value {
        font-size: 14px;
        color: #323233;
        font-weight: bold; // 强调数字或值
        max-width: 50%;
        word-break: break-all;
      }
    }
  }
}
</style>