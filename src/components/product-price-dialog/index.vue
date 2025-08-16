<template>
  <VanDialog
    :title="title"
    v-model:show="show"
    show-cancel-button
    :beforeClose="beforeClose"
    class="com-dialog-prod-price"
  >
    <div class="dialog-content">
      <PriceMod
        v-model:price="price"
        v-model:isSpec="isSpec"
        v-model:specDetials="specDetials"
        :mode="mode"
        ref="priceModRef"
      />
    </div>
  </VanDialog>
</template>

<script setup>
import { useProductPriceDialog } from './hook'
import PriceMod from '@/components/price-mod/index.vue'

const props = defineProps({
  title: {type: String, default: '产品价格'},
  mode: {type: Number, default: 1}
})

const {
  price, show, getPrice, beforeClose, isSpec, priceModRef, specDetials
} = useProductPriceDialog()

defineExpose({getPrice})

</script>

<style lang="scss">
.com-dialog-prod-price {
  .van-cell__title {
    width: 60px;
  }
  .dialog-content {
    max-height: 250px;
    overflow: auto;
  }
}

</style>