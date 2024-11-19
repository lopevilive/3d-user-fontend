<template>
  <VanActionSheet class="com-actions-sheet" v-model:show="isShow" :duration="0">
    <div v-for="group in actions" class="group">
      <VanButton
        v-for="actionItem in group"
        class="van-action-sheet__item"
        :text="actionItem.name"
        :icon="actionItem.icon"
        @click="selectHandle(actionItem)"
        :style="`color: ${actionItem.color};`"
      />
    </div>
  </VanActionSheet>
</template>

<script setup>
import { useActionsSheet } from './hook'

const emits = defineEmits(['select'])

const props = defineProps({
  actions: {type: Array, default: () => []}
})

const { show, isShow, selectHandle } = useActionsSheet(emits)

defineExpose({show})

</script>

<style lang="scss" scoped>
.com-actions-sheet {
  .group{
    margin: 0 $mrH;
  }
  .group:not(:last-child) {
    border-bottom: 1px solid $greyPlaceholder;
  }
}

</style>