<template>
  <VanField label="产品分类" readonly>
    <template #input>
      <div class="com-type-select-wrap">
        <div class="type-select">
          <div class="text" @click="showTypePicker = true">
            <div :class="{'none': !modelValue}">{{ productTypeDisplay }}</div>
            <div class="line">|</div>
          </div>
          <VanButton size="mini" type="primary" icon="plus" @click="showProductTypeDialog">新增</VanButton>
        </div>
        <div class="type-select sub-type-wrap" v-if="isShowSub">
          <div class="text" @click="showSubTypePicker = true">
            <div :class="{'none': !subTypeDisplay}">{{ subTypeDisplay || '选择二级分类' }}</div>
            <div class="line">|</div>
          </div>
          <VanButton size="mini" type="primary" icon="plus" @click="showSubProductTypeDialog">二级分类</VanButton>
        </div>
      </div>
    </template>
  </VanField>
  <Select v-model="val" :columns="productTypes" v-model:show="showTypePicker" />
  <Select v-model="subTypeDisplay" :columns="subTypeOpts" v-model:show="showSubTypePicker" />
  <ProductTypeDialog ref="productTypeDialogRef" />
</template>

<script setup>
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import Select from '@/components/select/index.vue'
import { useProdTypeSelect } from './hook'

const props = defineProps({
  modelValue: {type: [Number, String]}
})
const emits = defineEmits(['update:modelValue'])

const {
  val, productTypeDialogRef, showTypePicker, productTypeDisplay, productTypes, showProductTypeDialog,
  isShowSub, subTypeOpts, showSubTypePicker, subTypeDisplay, showSubProductTypeDialog
} = useProdTypeSelect(props, emits)

</script>

<style lang="scss" scoped>
.com-type-select-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  .sub-type-wrap {
    margin-top: 10px;
  }
}
.type-select {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 10px;
      .none {
        color: $greyPlaceholder;
      }
      .line {
        color: $greyPlaceholder;
      }
    }
  }

</style>