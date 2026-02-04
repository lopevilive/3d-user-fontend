<template>
  <div class="view-com-banner-item">
    <ItemWrap title="轮播图模块">
      <div class="content">
        <VanField :border="false">
          <template #label>
            <FormLabel label="轮播内容" :tips="tipsDisplay"/>
            (1/5)
          </template>
          <template #input>
            <UploadImgs :maxCount="5" v-model="displayUrl" />
          </template>
        </VanField>
        <VanField label="内容高度" readonly is-link @click="isShowScale = true" v-model="scaleDisplay" :border="false" />
        <VanField label="自动轮播">
          <template #input>
            <VanSwitch v-model="data.autoPlay" />
          </template>
        </VanField>
      </div>
    </ItemWrap>
    <Select v-model="data.scale" :columns="scaleColumns" v-model:show="isShowScale" />
  </div>
</template>

<script setup>
import ItemWrap from './ItemWrap.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { useItemBanner } from './itemBannerHook'
import Select from '@/components/select/index.vue'

const {
  data, displayUrl, tipsDisplay, isShowScale, scaleDisplay, scaleColumns
} = useItemBanner()



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