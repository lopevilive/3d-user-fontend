<template>
  <div class="view-com-item-home-desc">
    <ItemWrap title="店铺详情" @delete="$emit('delete')">
      <div class="content">
        <VanField :border="false">
          <template #label>
            <FormLabel label="店铺图片" :tips="tipsDisplay"/>
            ({{ urlLen }}/{{ MAX_UPLOAD_COUNT }})
          </template>
          <template #input>
            <UploadImgs :maxCount="MAX_UPLOAD_COUNT" v-model="displayUrl" ref="uploadImgsRef" :noWatermark="1"/>
          </template>
        </VanField>
      </div>
    </ItemWrap>
  </div>
</template>

<script setup>
import ItemWrap from './ItemWrap.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { useItemHomeDesc } from './itemHomeDescHook'

const emits = defineEmits(['delete', 'update:config'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const {
  displayUrl, MAX_UPLOAD_COUNT, urlLen, tipsDisplay, uploadImgsRef, valid
} = useItemHomeDesc(props, emits)

defineExpose({valid})

</script>

<style lang="scss" scoped>
.view-com-item-home-desc {
  .content {
    .van-cell {
      padding-left: 0;
      padding-right: 0;
      border-bottom: 1px solid $bgGrey;
    }
  }
}
</style>