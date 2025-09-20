<template>
  <VanField class="com-price-mod__type" v-if="[0,1].includes(mode)">
    <template #label>
      <FormLabel #default label="产品规格" tips="tmp">
        <div class="common-label-tips">
          <div>1.产品只有“大小”一个选项，这个时候选择【单级规格】</div>
          <br>
          <div>2.产品有“颜色”和“尺码”两个选项，这个时候选择【多级规格】</div>
        </div>

      </FormLabel>
    </template>
    <template #input>
      <VanRadioGroup v-model="specType">
        <VanRadio :name="0">无</VanRadio>
        <VanRadio :name="1">单级{{mode === 0 ? '规格': ''}}</VanRadio>
        <VanRadio :name="2">多级{{mode === 0 ? '规格': ''}}</VanRadio>
      </VanRadioGroup>
    </template>
  </VanField>
  <VanField
    class="com-price-mod__price"
    label="产品价格"
    :rules="[{validator: valiPrice}]"
    :right-icon="[1,2].includes(specType) ? 'arrow' : ''"
  >
    <template #input>
      <div class="content">
        <div class="content__head">
          <div class="left__inp">
            <VanField v-if="specType === 0" v-model="priceDisplay" placeholder="请输入价格(选填)" class="pd0" :border="false"/>
            <div v-if="[1,2].includes(specType)" class="desc-txt" @click="toEditSpecHandle">{{ displaySpecTxt }}</div>
          </div>
        </div>
      </div>
    </template>
  </VanField>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePriceMod } from './hook'

const props = defineProps({
  price: {type: String},
  isSpec: {type: Number},
  specDetials: {type: String},
  isDialog: {type: Boolean, default: false},
  mode: {type: Number, default: 0} // 1 隐藏规格两个字、 2 仅支持修改价格
})

const emits = defineEmits(['update:price', 'update:isSpec', 'update:specDetials', 'resetValidation'])

const {
  shopInfo, init, priceDisplay, valiPrice, specType, toEditSpecHandle, displaySpecTxt
} = usePriceMod(props, emits)

init()

defineExpose({valiPrice, init})

</script>


<style lang="scss" scoped>
.com-price-mod__type {
  :deep(.van-radio-group) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .van-radio:not(:last-child) {
      margin-right: 12px;
    }
  }
}
.com-price-mod__price {
  .content {
    width: 100%;
    .content__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .left__inp {
        flex: 1;
        display: flex;
        :deep(.van-radio:first-child) {
          margin-bottom: 5px;
        }
        .desc-txt {
          width: 100%;
          text-align: right;
          color: $grey8;
        }
      }
    }
    // .content__spec {
    //   padding-top: 5px;
    //   .spec-item {
    //     width: 100%;
    //     display: flex;
    //     justify-content: space-between;
    //     border-bottom: 1px solid $bgGrey2;
    //     padding-bottom: 5px;
    //     margin-bottom: 5px;
    //     align-items: center;
    //     .name {
    //       width: 50%;
    //       flex-shrink: 0;
    //       margin-right: 10px;
    //     }
    //     :deep(.van-icon) {
    //       font-size: 18px;
    //     }
    //     .move {
    //       color: #5794f7;
    //       padding: 0 4px;
    //       margin-left: 4px;
    //     }
    //     .del {
    //       color: $red;
    //       margin-left: 5px;
    //     }
    //   }
    // }
    
  }
}

</style>