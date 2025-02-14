<template>
  <VanActionSheet class="com-actions-sheet" v-model:show="isShow" :duration="0">
    <div v-for="group in actions" class="group">
      <div class="group-item" v-for="actionItem in group">
        <VanIcon class="item__icon" :style="`color: ${actionItem.color};`" v-if="actionItem.icon" :name="actionItem.icon" />
        <VanButton
          class="van-action-sheet__item"
          :text="actionItem.name"
          @click="selectHandle(actionItem)"
          :style="`color: ${actionItem.color};`"
        />
      </div>
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
    .group-item {
      position: relative;
      .item__icon {
        font-size: 20px;
        position: absolute;
        left: 33%;
        top: 13px;
        z-index: 10;
      }
    }
  }
  .group:not(:last-child) {
    border-bottom: 1px solid $greyPlaceholder;
  }
}

</style>