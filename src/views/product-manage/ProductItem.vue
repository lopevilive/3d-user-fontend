<template>
  <div class="com-product-item" :class="{'shake': globalData.editStatus === 1}">
    <div class="content" @click="handleClick">
      <div class="img">
        <VanImage fit="contain" :src="getImageUrl(urlDisplay)" />
      </div>
      <div class="desc">{{ data.desc }}</div>
      <div class="price" v-if="data.price">¥ {{ data.price }}</div>
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
    <VanCheckbox v-model=checked shape="square" v-if="globalData.editStatus === 1" @change="changeHandle"/>
  </div>
</template>

<script setup>
import { globalData } from '@/store'
import { useProductItem } from './hook'
import { getImageUrl } from '@/util'

const props = defineProps({
  data: {type: Object, default: () => {}}
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
} = useProductItem(props,emits)

</script>

<style lang="scss" scoped>
.com-product-item {
  width: 94%;
  flex-shrink: 0;
  background-color: $bgWhite;
  margin-bottom: $mrM;
  box-sizing: border-box;
  position: relative;
  :deep(.van-checkbox) {
    position: absolute;
    right: 3px;
    top: 3px;
    .van-checkbox__icon {
      height: auto;
      .van-icon {
        font-size: 20px;
        border-width: 2px;
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $pdM;
    box-sizing: border-box;
  }
  .img {
    overflow: hidden;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    :deep(.van-image__img){
      max-height: 240px;
    }
  }
  .desc {
    line-height: 20px;
    color: $grey;
    width: 100%;
    padding-top: $pdM;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
  .price {
    font-weight: bold;
    width: 100%;
    margin-top: $mrL;
    color: $grey;
  }
  .setting {
    position: absolute;
    top: -10px;
    left: 0px;
    font-size: 16px;
    z-index: 100;
    padding: 10px;
    :deep(.van-icon) {
      width: 28px;
      height: 28px;
      background: #929ca7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
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