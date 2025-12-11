<template>
  <div class="view-mul-spec-price">
    <div class="spec-summary">
      <div class="head-left">
        <div class="tit">共<span class="count"> {{ dispyalSpecInfoList.length }} </span>个规格：</div>
        <div class="summary-list">{{ displayItemTit }}</div>
      </div>
      <div class="head-right">
        <div @click="filterHandle">筛选<VanIcon name="arrow-down"/></div>
      </div>
    </div>
    <div class="spec-content">
      <div class="head-wrap">
        <div>规格列表：</div>
        <VanCheckbox v-model="mulUseImgDisplay">图片</VanCheckbox>
      </div>
      <div class="spec-list">
        <template v-for="(item, idx) in specInfoList">
          <div class="spec-item"  v-if="isShowItem(item)">
            <div class="item-tit">{{ getDisplayName(item.list) }}</div>
            <div class="price-wrap">
              <VanField label="价格" placeholder="请输入价格（选填）"  :maxlength="10" v-model="item.price"></VanField>
              <VanCheckbox :modelValue="item.specStatus === 1" @click="specStatusHandle(item)">上架</VanCheckbox>
            </div>
            <VanField label="图片" v-if="mulUseImgDisplay" class="img-wrap">
              <template #input>
                <UploadImgs :maxCount="1" :ref="(el) => {
                  uploadImgsRef[idx] = el
                }" :modelValue="getDisplayUrl(item)" @update:modelValue="(url) => {
                  updateImgHandle(url, item)
                }" />
              </template>
            </VanField>
          </div>
        </template>
        
      </div>
    </div>
    <div class="bottom-btn">
      <VanButton text="批量改价" block @click="mulPirceMod"/>
      <VanButton text="保存" @click="saveHandle" block type="primary" />
    </div>
  </div>
  <InputDialog ref="inputDialogRef" />
  <FilterSpecs ref="filterSpecsRef" :mulSpecs="mulSpecs" />
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useMulSpecPrice } from './mulSpecPriceHook'
import UploadImgs from '@/components/uploadImgs/index.vue'
import InputDialog from '@/components/input-dialog/index.vue'
import FilterSpecs from './FilterSpecs.vue'

const {
  saveHandle, beforeDestory, init, mulUseImgDisplay, displayItemTit, getDisplayName, specInfoList,
  specStatusHandle, uploadImgsRef, inputDialogRef, mulPirceMod, updateImgHandle, getDisplayUrl, filterSpecsRef,
  filterHandle, mulSpecs, isShowItem, dispyalSpecInfoList
} = useMulSpecPrice()

init()

onUnmounted(beforeDestory)


</script>

<style lang="scss" scoped>
.view-mul-spec-price {
  padding-bottom: $footerBarH;
  box-sizing: border-box;
  background: $bgWhite;
  min-height: 100%;
  .spec-summary {
    display: flex;
    box-sizing: border-box;
    padding: $pdM;
    background: $bgWhite;
    border-bottom: 1px solid $bgGrey;
    justify-content: space-between;
    .head-left {
      display: flex;
      .tit {
        flex-shrink: 0;
      }
      .count {
        color: $themeColor;
      }
    }
    
    .head-right {
      flex-shrink: 0;
      height: 100%;
      display: flex;
      align-items: center;
      color: $btnText;
      margin-left: 5px;
    }
  }
  .spec-content {
    margin-top: 2px;
    background: $bgWhite;
    padding: $pdM;
    .head-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      :deep(.van-checkbox) {
        margin-left: 10px;
      }
    }
    .spec-item {
      background: $bgGrey;
      padding: $pdH;
      box-sizing: border-box;
      border-radius: $bdrM;
      margin-bottom: 10px;
      .price-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        :deep(.van-checkbox) {
          flex-shrink: 0;
          margin-left: 12px;
        }
      }
      .img-wrap {
        margin-top: 12px;
      }
      :deep(.van-cell) {
        background: inherit;
        padding: 0;
        .van-cell__title {
          width: 50px;
        }
        .van-field__body {
          input {
            background: $bgWhite;
            padding: 2px 5px;
          }
        }
      }
    }
  }
  .bottom-btn {
    z-index: 10;
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    height: $footerBarH;
    display: flex;
    padding-top: 10px;
    border-top: 1px solid $bgGrey3;
    :deep(.van-button:first-child) {
      margin-right: 20px;
    }
  }
}

</style>