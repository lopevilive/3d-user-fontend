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
  actionsSheetRef,
  offset,
  bubbleClickHandle,
  actionHandle
} = useSetting(props)

</script>

<style lang="scss" scoped>

</style>

