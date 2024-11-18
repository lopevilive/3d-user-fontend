<template>
  <div class="view-contact">
    <ImgSwipe :list="imgList" :mode="2"/>
    <VanCellGroup>
      <VanCell v-if="shopInfo.desc" title="公司简介" :label="shopInfo.desc"></VanCell>
      <VanCell v-if="addressDisplay" title="联系地址" :label="addressDisplay">
        <template #value>
          <VanButton size="small" text="复制地址" @click="copyStr(addressDisplay)" />
        </template>
      </VanCell>
      <VanCell v-if="shopInfo.phone || shopInfo.qrcodeUrl" title="联系方式" :label="shopInfo.phone">
        <template #value>
          <a v-if="shopInfo.phone" :href="`tel:${shopInfo.phone}`"><VanButton size="small" text="拨打" /></a>
          <VanButton v-if="shopInfo.phone" class="mr-l" size="small" text="复制号码" @click="copyStr(shopInfo.phone)"/>
          <!-- todo -->
          <VanButton v-if="shopInfo.qrcodeUrl" class="mr-l" size="small" text="添加微信" @click="toViewQr" />
        </template>
      </VanCell>
    </VanCellGroup>
    <Setting />
  </div>
</template>

<script setup>
import {useContact} from './hook'
import ImgSwipe from '@/components/img-swipe/index.vue'
import Setting from '@/components/setting/index.vue'

const {
  shopInfo,
  init,
  imgList,
  addressDisplay,
  copyStr,
  toViewQr
} = useContact()

init()


</script>

<style lang="scss" scoped>
.view-contact {
  margin-bottom: $footerBarH;
  :deep(.van-cell) {
    .van-cell__value {
      position: absolute;
      right: 12px;
      top: 3px;
    }
    .mr-l {
      margin-left: $mrL;
    }
  }
}


</style>