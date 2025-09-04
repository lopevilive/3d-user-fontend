<template>
  <VanField readonly>
    <template #label>
      <slot name="label">
        产品分类
      </slot>
    </template>
    <template #input>
      <div class="com-type-select-wrap">
        <div class="type-select">
          <div class="text" @click="textClickHandle">
            <div :class="{'none': !modelValue}">{{ productTypeDisplay }}</div>
            <div class="line">|</div>
          </div>
          <VanButton
            size="mini" type="primary" icon="plus" @click="showProductTypeDialog"
            v-if="!mulTypeDisplay"
          >新增</VanButton>
          <div class="line" v-if="isShowMul && !mulTypeDisplay">|</div>
          <div v-if="isShowMul">
            <VanCheckbox shape="square" v-model="mulTypeDisplay" >多分类</VanCheckbox>
          </div>
          <div class="line" v-if="showDel">|</div>
          <VanIcon name="delete-o" class="del-btn" v-if="showDel" @click="delHandle" />
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
  <VanField label=" " readonly is-link v-if="mulTypeDisplay">
    <template #input>
      <div class="desc-txt" @click="toEditMulHandle">
        {{ displayMulTxt }}
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
  modelValue: {type: [Number, String]},
  isMulType: {type: Number, default: 0},
  mode: {type: Number, default: 0},
  showDel: {type: Boolean, default: false}
})
const emits = defineEmits(['update:modelValue', 'update:isMulType', 'del'])

const {
  val, productTypeDialogRef, showTypePicker, productTypeDisplay, productTypes, showProductTypeDialog,
  isShowSub, subTypeOpts, showSubTypePicker, subTypeDisplay, showSubProductTypeDialog, mulTypeDisplay,
  toEditMulHandle, isShowMul, delHandle, displayMulTxt, textClickHandle
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
  align-items: center;
  .text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .none {
      color: $greyPlaceholder;
    }
  }
  .line {
    color: $greyPlaceholder;
    margin: 0 8px
  }
  .del-btn {
    font-size: 20px;
    color: red;
  }
}
.desc-txt {
  width: 100%;
  text-align: right;
  color: $grey8;
}

</style>