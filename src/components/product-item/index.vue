<template>
  <div class="com-product-item" :class="{'shake': globalData.editStatus === 1}">
    <div class="content">
      <div class="img" @click="handleClick"><VanImage fit="contain" :src="urlDisplay" /></div>
      <div class="info-content">
        <div class="desc" @click="handleClick">
          <span v-if="isShowSticky"><VanTag plain type="primary">置顶</VanTag></span>
          {{ data.desc }}
        </div>
        <div class="attr" v-if="displayAttrs"> {{ displayAttrs }}</div>
        <div class="price-content">
          <div class="price" >
            <span class="unit" v-if="priceDisplay">¥</span>
            <span class="num">{{ priceDisplay || '' }}</span>
          </div>
          <AddControls :productInfo="data" />
        </div>
      </div>
    </div>
    <div class="setting" v-if="globalData.editStatus === 1" @click="settingClickHandle">
      <VanIcon name="edit" />
    </div>
    <VanActionSheet
      :actions="actions"
      v-model:show="isShow"
      cancel-text="取消"
      teleport="body"
      @select="selectHandle"
    />
    <VanCheckbox v-model="checked" shape="square" v-if="globalData.editStatus === 1" @change="changeHandle"/>
  </div>
</template>

<script setup>
import { globalData } from '@/store'
import { useProductItem } from './hook'
import AddControls from '@/components/add-controls/index.vue'

const props = defineProps({
  data: {type: Object}
})

const emits = defineEmits(['update','selected'])

const {
  actions,
  isShow,
  settingClickHandle,
  selectHandle,
  handleClick,
  urlDisplay,
  checked,
  changeHandle,
  displayAttrs,
  isShowSticky,
  priceDisplay
} = useProductItem(props,emits)

</script>

<style lang="scss" scoped>
.com-product-item {
  width: 96%;
  flex-shrink: 0;
  background-color: $bgWhite;
  margin-bottom: $mrM;
  box-sizing: border-box;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  :deep(.van-checkbox) {
    position: absolute;
    left: 3px;
    top: 3px;
    background: $bgWhite;
    .van-checkbox__icon {
      height: auto;
      .van-icon {
        font-size: 24px;
        border-width: 2px;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    // padding: $pdM;
    box-sizing: border-box;
    padding-bottom: $pdM;
    .info-content {
      width: 100%;
      padding: 0 $pdL;
      box-sizing: border-box;
      margin-top: $mrL;
    }
  }
  .img {
    overflow: hidden;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    :deep(.van-image__img){
      max-height: 250px;
    }
  }
  .desc {
    line-height: 20px;
    color: $grey;
    width: 100%;
    // padding-top: $pdM;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
  .attr {
    font-size: 12px;
    width: 100%;
    color: $grey8;
    margin-top: 4px;
  }
  .price-content {
    width: 100%;
    margin-top: 4px;
    display: flex;
    justify-content: space-between;
    .price {
      color: $red;
      flex: 1;
      .unit {
        font-size: 12px;
      }
      .num {
        font-weight: bold;
        font-size: 16px;
        word-break: break-all;
      }
    }
    .com-add-controls {
      flex-shrink: 0;
    }
  }
  .setting {
    position: absolute;
    top: -10px;
    right : 0px;
    font-size: 16px;
    z-index: 100;
    padding: 10px;
    :deep(.van-icon) {
      width: 28px;
      height: 28px;
      background: $bgWhite;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      border: 1px solid #c8c9cc;
    }
  }
}
.shake {
  animation: shake 180ms infinite linear;
}
@keyframes shake {
  10%, 25% { transform: rotate(0.3deg); }
  25%, 50% { transform: rotate(0deg); }
  50%, 75% { transform: rotate(-0.3deg); }
  75%, 100% { transform: rotate(0deg); }
}

</style>