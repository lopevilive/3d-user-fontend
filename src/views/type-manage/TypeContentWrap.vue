<template>
  <div class="view-com-type-content-wrap">
    <div class="left-content"><slot></slot></div>
    <div class="right-content">
      <!-- <VanIcon name="edit" @click="handleSettingClick"/> -->
      <VanIcon name="setting-o" @click="handleSettingClick"/>
    </div>
  </div>
</template>

<script setup>

const emits = defineEmits(['setClick'])

const handleSettingClick = () => {
  emits('setClick')
}

</script>

<style lang="scss" scoped>
.view-com-type-content-wrap {
  display: flex;
  justify-content: space-between;
  // align-items: center;
  .left-content {
    flex: 1;
  }
  .right-content {
    flex-shrink: 0;
    padding-right: 8px;
    :deep(.van-icon) {
      padding: 5px;
      font-size: 24px;
    }
  }
}
</style>
