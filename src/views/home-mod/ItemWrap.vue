<template>
  <div class="view-com-item-wrap">
    <div class="slot-content">
      <div class="tit">{{ title }}</div>
      <slot></slot>
    </div>
    <div class="btn-wrap">
      <!-- <span class="control-item">上移</span>
      <span class="control-item">下移</span> -->
      <span class="control-item">删除</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {type: String, default: ''}
})

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