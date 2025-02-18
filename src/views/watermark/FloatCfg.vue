<template>
  <VanFloatingBubble
    class="view-com-watermark__float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offset"
    @click="handleClick"
  >
    <div class="content">
      <VanIcon name="edit"/>
    </div>
  </VanFloatingBubble>
  <ActionsSheet
    ref="actionsSheetRef"
    cancel-text="取消"
    :actions="actions"
    close-on-click-action
    @select="selectHandle"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getFlexW } from '@/util'
import ActionsSheet from '@/components/actions-sheet/index.vue'

const emits = defineEmits(['text', 'img', 'changeImg'])

const gap = getFlexW(24)
const offset = ref({ x: getFlexW(375 - 24 - 30), y: window.innerHeight * 0.6});

const actionsSheetRef = ref()
const handleClick = () => {
  actionsSheetRef.value.show()
}

const selectHandle = (item) => {
  emits(item.value)
}

const actions = [
  [
    {name: '文字水印', color: '#5794f7', value: 'text'},
    {name: '图片水印', color: '#5794f7', value: 'img'},
  ],
  [ {name: '更换预览图', color: '#64b486', value: 'changeImg'} ]
]


</script>

<style lang="scss">
.view-com-watermark__float {
  width: 30px;
  height: 30px;
}

</style>
