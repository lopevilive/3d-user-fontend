<template>
  <div class="view-com-item-home-desc">
    <ItemWrap title="店铺详情" @delete="$emit('delete')">
      <div class="content">
        <VanField :border="false">
          <template #label>
            <FormLabel label="店铺图片" />
            ({{ data.urlList.filter(item => item.url).length }}/{{ MAX_UPLOAD_COUNT }})
          </template>
          <template #input>
            <UploadImgs :maxCount="MAX_UPLOAD_COUNT" v-model="displayUrl" />
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

defineEmits(['delete'])

const {
  data, displayUrl, MAX_UPLOAD_COUNT
} = useItemHomeDesc()

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