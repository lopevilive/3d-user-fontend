<template>
  <div class="com-setting">
     <VanFloatingBubble
      class="setting-floating"
      axis="xy"
      magnetic="x"
      :gap="0"
      v-model:offset="offset"
      @click="bubbleClickHandle"
      v-if="isShow"
    >
      <div class="content">
        <VanIcon name="setting-o"/>
      </div>
    </VanFloatingBubble>
    <ActionsSheet
      ref="actionsSheetRef"
      :actions="actionDisplay"
      @select="actionHandle"
      close-on-click-action
      cancel-text="取消"
    />
    <div class="done" v-if="isShowDone" @click="handleDone">完成</div>
  </div>
</template>

<script setup>
import { useSetting } from './hook'
import ActionsSheet from '@/components/actions-sheet/index.vue'

const props = defineProps({
  runtimeData: {type: Object}
})

const {
  actionDisplay,
  isShow,
  isShowDone,
  handleDone,
  actionsSheetRef,
  offset,
  bubbleClickHandle,
  actionHandle
} = useSetting(props)

</script>

<style lang="scss" scoped>
.com-setting {
  .done{
    position: fixed;
    right: 10px;
    top: 10px;
    background: #7e7e80;
    border-radius: 40px;
    padding: 5px 20px;
    font-weight: bold;
    font-size: 12px;
  }
}

</style>

