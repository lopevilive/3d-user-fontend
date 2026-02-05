<template>
  <div class="view-com-item-wrap">
    <div class="slot-content">
      <div class="tit">{{ title }}</div>
      <slot></slot>
    </div>
    <div class="btn-wrap">
      <span class="control-item" @click="handleDelete">
        删除
      </span>
    </div>
  </div>
</template>

<script setup>
import { showConfirmDialog } from 'vant';

const props = defineProps({
  title: {type: String, default: ''}
})

const emit = defineEmits(['delete'])

const handleDelete = async () => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这个模块吗？'
    })
    emit('delete')
  } catch {
    // 用户取消
  }
}

</script>

<style lang="scss" scoped>
.view-com-item-wrap {
  border: 1px solid $bgGrey2;
  background: $bgWhite;
  .slot-content {
    .tit {
      font-weight: bold;
      margin-bottom: 10px;
    }
    padding: $pdL;
    box-sizing: border-box;
  }
  .btn-wrap {
    display: flex;
    justify-content: flex-end;
    .control-item {
      padding: 3px 10px;
      border: 1px solid #e3e3e3;
      color: $grey7;
    }
  }
}
</style>