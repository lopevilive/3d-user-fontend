<template>
  <div class="view-sepc-edit">
    <CommonUseSpecs
      :isSpec="isSpec"
      :singleSpecs="singleSpecs"
      :mulSpecs="mulSpecs"
      @add="addHandle"
    />
    <div class="tit-wrap">
      <span>规格列表：</span>
      <VanCheckbox v-model="singleUseImgDisplay" v-if="isSpec === 1">图片</VanCheckbox>
    </div>
    <!-- 单级规格 -->
    <div class="spec-list" v-if="isSpec === 1">
      <div class="spec-item" v-for="(item, itemIdx) in singleSpecs">
        <VanField :label="`${itemIdx+1}.名称`" placeholder="请输入名称(如：大、小)" v-model="item.name" :maxlength="12"></VanField>
        <VanField label="价格" placeholder="请输入价格 (选填)" v-model="item.price" :maxlength="10"></VanField>
        <VanField label="图片" v-if="singleUseImgDisplay">
          <template #input>
            <UploadImgs :maxCount="1" :ref="(el) => {
              uploadImgsRef[itemIdx] = el
            }" v-model="item.url"/>
          </template>
        </VanField>
        <div class="contorl-list">
          <span class="control-item" v-if="isShowMoveTop(itemIdx)" @click="moveTopHandle(itemIdx)">上移</span>
          <span class="control-item" v-if="isShowMoveDown(itemIdx)" @click="moveDownHandle(itemIdx)">下移</span>
          <span class="control-item" v-if="isShowInsert(itemIdx)" @click="insertHandle(itemIdx)">插入</span>
          <span class="control-item" v-if="isShowDel(itemIdx)" @click="delHandle(itemIdx)">删除</span>
        </div>
      </div>
    </div>
    <!-- 多级规格 -->
    <div class="mul-spec-list" v-if="isSpec === 2">
      <div class="mul-spec-item" v-for="(item, itemIdx) in mulSpecs">
        <div class="name-wrap" @click="modMulName(itemIdx)">
          <span>{{itemIdx + 1}}. {{ item.name }}</span>
          <VanIcon name="edit"/>
        </div>
        <div class="spec-name-list">
          <div class="item" v-for="(subItem, subItemIdx) in item.list" @click="subItemClickHandle(itemIdx, subItemIdx)">
            <VanImage v-if="subItem.url"  :src="getImageUrl(subItem.url)" />
            <span>{{ subItem.name }}</span>
          </div>
        </div>
        <VanButton class="add-btn" text="添加规格" icon="plus" size="small" @click="addSubSpecHandle(itemIdx)" />
        <div class="mul-use-img-wrap">
          <VanCheckbox :modelValue="item.useImg === 1" @click="mulImgClickHandle(itemIdx)" />
          <div class="txt" v-if="item.useImg === 0">图片</div>
          <div class="txt" v-if="item.useImg === 1" @click="toEditImg(itemIdx)">编辑图片 <VanIcon name="arrow"/></div>
        </div>
        <div class="contorl-list">
          <span class="control-item" v-if="isShowMulMoveTop(itemIdx)" @click="mulMoveTopHandle(itemIdx)">上移</span>
          <span class="control-item" v-if="isShowMulMoveDown(itemIdx)" @click="mulMoveDownHandle(itemIdx)">下移</span>
          <span class="control-item" @click="mulDelHandle(itemIdx)">删除</span>
        </div>
      </div>
    </div>
    <div class="add-spec">
      <VanButton :text="addBtnText" block @click="addSpecHandle" :disabled="disabledAddBtn" />
    </div>
    <div class="bottom-btn">
      <template v-if="isSpec === 1">
        <VanButton text="批量改价" block @click="modSinglePrice" />
        <VanButton text="保存" @click="saveHandle" block type="primary" />
      </template>
      <template v-if="isSpec === 2">
        <VanButton text="下一步" block type="primary" @click="nextStepHandle"/>
      </template>
    </div>
  </div>
  <InputDialog ref="inputDialogRef" />
  <SpecAction ref="specActionRef" />
  <ImgModDialog ref="imgModDialogRef" />
</template>

<script setup>
import { onUnmounted } from 'vue'
import { useSpecEdit } from './hook'
import UploadImgs from '@/components/uploadImgs/index.vue'
import InputDialog from '@/components/input-dialog/index.vue'
import SpecAction from './SpecAction.vue'
import ImgModDialog from './ImgModDialog.vue'
import { getImageUrl } from '@/util'
import CommonUseSpecs from './CommonUseSpecs.vue'

const { 
  singleSpecs, addSpecHandle, init, saveHandle, beforeDestory, singleUseImgDisplay, isSpec,
  addBtnText, inputDialogRef, mulSpecs, modMulName, addSubSpecHandle, nextStepHandle, isShowMoveTop,
  isShowMoveDown, isShowInsert, isShowDel, moveTopHandle, moveDownHandle, insertHandle, delHandle,
  disabledAddBtn, uploadImgsRef, isShowMulMoveTop, isShowMulMoveDown, mulMoveDownHandle,
  mulMoveTopHandle, mulDelHandle, specActionRef, subItemClickHandle, mulImgClickHandle, toEditImg,
  imgModDialogRef, addHandle, modSinglePrice
 } = useSpecEdit()

 init()

 onUnmounted(beforeDestory)

</script>

<script>
export default {
  name: 'SpecEdit'
}

</script>

<style scoped lang="scss">
.view-sepc-edit  {
  padding-bottom: $footerBarH;
  box-sizing: border-box;
  background: $bgWhite;
  min-height: 100%;
  .tit-wrap {
    padding:$pdH $pdM;
    display: flex;
    align-items: center;

  }
  .spec-list {
    padding: 0 $pdH;
    box-sizing: border-box;
    .spec-item {
      background: $bgGrey;
      overflow: hidden;
      margin-bottom: 15px;
      :deep(.van-cell) {
        background: inherit;
        .van-field__body {
          input {
            background: $bgWhite;
            padding: 2px 5px;
          }
        }
      }
    }
  }
  .add-spec {
    padding: 0 20px;
    margin: 20px 0;
  }
  .contorl-list {
    display: flex;
    justify-content: flex-end;
    padding: $pdM 0 0 0;
    box-sizing: border-box;
    .control-item {
      padding: 3px 10px;
      border: 1px solid #e3e3e3;
      color: $grey7;
    }
  }
  .mul-spec-list {
    padding: 0 $pdH;
    box-sizing: border-box;
    .mul-spec-item {
      border: 1px solid $bgGrey;
      box-sizing: border-box;
      padding: $pdM;
      margin-bottom: 10px;
      .name-wrap {
        display: flex;
        align-items: center;
        :deep(.van-icon) {
          font-size: 18px;
          color: $grey8;
          margin-left: 5px;
        }
      }
      .mul-use-img-wrap {
        display: flex;
        align-items: center;
        .txt {
          margin-left: 10px;
          display: flex;
          align-items: center;
        }
      }
      .spec-name-list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 10px;
        box-sizing: border-box;
        .item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          background: $bgGrey;
          padding: 5px 10px;
          margin-bottom: 10px;
          margin-right: 10px;
          :deep(.van-image) {
            width: 20px;
            height: 20px;
            margin-right: 5px;
          }
        }
      }
      .add-btn {
        margin-bottom: 10px;
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
    :deep(.van-button) {
      margin: 0 10px;
    }
  }
}

</style>