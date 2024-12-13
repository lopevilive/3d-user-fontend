<template>
  <div class="com-setting">
     <VanFloatingBubble
      class="setting-floating"
      axis="xy"
      magnetic="x"
      :gap="gap"
      v-model:offset="offset"
      @click="bubbleClickHandle"
      v-if="isShow"
    >
      <div class="content">
        <VanIcon name="edit"/>
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

const emits = defineEmits(['update'])

const {
  actionDisplay,
  isShow,
  actionsSheetRef,
  offset,
  bubbleClickHandle,
  actionHandle,
  gap
} = useSetting(props, emits)

</script>

<style lang="scss" >
.setting-floating {
  width: 30px;
  height: 30px;
}
</style>

