<template>
  <div class="view-com-banner-item">
    <ItemWrap title="轮播图模块" @delete="$emit('delete')">
      <div class="content">
        <VanField :border="false">
          <template #label>
            <FormLabel label="轮播内容" :tips="tipsDisplay"/>
            ({{ urlLen }}/{{ MAX_UPLOAD_COUNT }})
          </template>
          <template #input>
            <UploadImgs :maxCount="MAX_UPLOAD_COUNT" v-model="displayUrl" ref="uploadImgsRef" />
          </template>
        </VanField>
        <VanField label="内容高度" readonly is-link @click="isShowScale = true" v-model="scaleTxt" :border="false" />
        <VanField label="自动轮播">
          <template #input>
            <VanSwitch v-model="autoPlayDisplay" />
          </template>
        </VanField>
      </div>
    </ItemWrap>
    <Select :columns="scaleColumns" v-model:show="isShowScale" v-model="scaleDisplay" />
  </div>
</template>

<script setup>
import ItemWrap from './ItemWrap.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { useItemBanner } from './itemBannerHook'
import Select from '@/components/select/index.vue'

const emits = defineEmits(['delete', 'update:config'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const {
  displayUrl, tipsDisplay, isShowScale, scaleTxt, scaleColumns, MAX_UPLOAD_COUNT, urlLen,
  scaleDisplay, autoPlayDisplay, uploadImgsRef, valid
} = useItemBanner(props, emits)

defineExpose({valid})



</script>

<style lang="scss" scoped>
.view-com-banner-item {
  .content {
    .van-cell {
      padding-left: 0;
      padding-right: 0;
      border-bottom: 1px solid $bgGrey;
    }
  }

}


</style>