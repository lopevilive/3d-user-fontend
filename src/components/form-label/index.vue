<template>
  <div class="com-form-label">
    <div class="content">
      <div>{{ label }}<VanIcon name="info-o" v-if="tips" @click="tipsHandle"/></div>
    </div>
  </div>
  <VanDialog v-model:show="show">
    <div class="form-label-dialog">
      <slot>
        <p class="tips-content">{{ tips }}</p>
      </slot>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: {type: String},
  tips: {type: String, default: ''}
})

const show = ref(false)

const tipsHandle = () => {
  show.value = true
}

</script>

<style lang="scss">
.com-form-label {
  display: inline-block;
  .content {
    .van-icon {
      color: #68b5eb;
      font-size: 16px;
      margin-left: 2px;
      position: relative;
      top: 2px;
    }

  }
}
.form-label-dialog {
  width: 100%;
  box-sizing: border-box;
  
  .tips-content {
    padding: 24px;
    color: $grey7;
    font-size: $fsM;
    .item {
      font-weight: bold;
    }
  }
}

</style>