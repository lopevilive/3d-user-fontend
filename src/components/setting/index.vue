<template>
  <div class="com-setting">
     <VanFloatingBubble
      class="setting-floating"
      axis="xy"
      magnetic="x"
      :gap="gap"
      v-model:offset="offsetDisPlay"
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
    <UpdateAlbum ref="updateAlbumRef"/>
    <ModShopStatus ref="modShopStatusRef"/>
  </div>
</template>

<script setup>
import { useSetting } from './hook'
import ActionsSheet from '@/components/actions-sheet/index.vue'
import UpdateAlbum from './UpdateAlbum.vue'
import ModShopStatus from './ModShopStatus.vue'

const {
  actionDisplay,
  isShow,
  actionsSheetRef,
  bubbleClickHandle,
  actionHandle,
  gap,
  updateAlbumRef,
  modShopStatusRef,
  offsetDisPlay
} = useSetting()

</script>

<style lang="scss" >
.setting-floating {
  width: 30px;
  height: 30px;
}
</style>

