<template>
  <div class="com-form-label">
    <div class="content">
      <div>{{ label }}</div>
      <VanIcon name="info-o" v-if="tips" @click="tipsHandle"/>
    </div>
  </div>
</template>

<script setup>
import { showDialog } from 'vant';

const props = defineProps({
  label: {type: String},
  tips: {type: String, default: ''}
})

const tipsHandle = () => {
  showDialog({
    message: props.tips
  })
}

</script>

<style lang="scss" scoped>
.com-form-label {
  display: inline-block;
  .content {
    display: flex;
    width: 100%;
    align-items: center;
    :deep(.van-icon) {
      color: #68b5eb;
      font-size: 16px;
      margin-left: 2px;
    }

  }
}

</style>