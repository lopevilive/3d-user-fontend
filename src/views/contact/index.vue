<template>
  <div class="view-contact" v-if="!loading">
    <ImgSwipe :list="imgList" :mode="2"/>
    <VanCellGroup>
      <VanCell :title="shopInfo.name" :label="shopInfo.desc"></VanCell>
      <VanCell v-if="addressDisplay" title="联系地址" :label="addressDisplay">
        <template #value>
          <VanButton size="small" text="复制地址" @click="copyStr(addressDisplay)" />
        </template>
      </VanCell>
      <VanCell v-if="isShowConcat" title="联系方式" :label="shopInfo.phone">
        <template #value>
          <a v-if="shopInfo.phone" :href="`tel:${shopInfo.phone}`"><VanButton size="small" text="拨打" /></a>
          <VanButton v-if="shopInfo.phone" class="mr-l" size="small" text="复制号码" @click="copyStr(shopInfo.phone)"/>
          <VanButton v-if="shopInfo.qrcodeUrl" class="mr-l" size="small" text="添加微信" @click="toViewQr" />
        </template>
      </VanCell>
      <VanCell v-if="isShowToEdit" title="联系方式">
        <template #value>
          <div class="to-edit">
            <div>暂未填写联系方式</div>
            <VanButton class="mr-l" size="small" text="去填写" @click="toEdit" />
          </div>
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
import {globalLoading, copyStr} from '@/util'

const {
  shopInfo,
  init,
  imgList,
  addressDisplay,
  toViewQr,
  isShowConcat,
  isShowToEdit,
  toEdit
} = useContact()

const loading = globalLoading.getRef()

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
    .to-edit {
      display: flex;
      align-items: center;
    }
  }
}


</style>