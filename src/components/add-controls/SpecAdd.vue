<template>
  <VanActionSheet
    v-model:show="isShow"
    cancel-text="完成"
    teleport="body"
  >
    <div class="com-sepc-add__content">
      <div class="head-content">
        <div class="img-wrap">
          <VanImage fit="cover" :src="displayUrl" @click="viewImg(displayUrl)" />
        </div>
        <div class="price-info">
          <div class="price">
            <span class="unit">¥</span>
            <span class="count">{{ priceDisplay }}</span>
          </div>
          <div class="selected-spec">{{ displaySelectedTxt }}</div>
        </div>

      </div>
      <div class="spec-list-wrap">
        <div class="spec-parent-item" v-for="(specItem, idx) in displaySpecList">
          <div class="parent-name">{{ specItem.name }}</div>
          <div class="child-list">
            <div class="child-item "
              v-for="(subItem, subIdx) in specItem.list"
              :class="{'active': isActive(idx, subIdx), item__disabled: isDisabled(idx, subIdx)}"
              @click="subSpecClickHandle(idx, subIdx)"
            >
              <div>{{ subItem.name }}</div>
            </div>
          </div>

        </div>
      </div>
      <div class="count-wrap">
        <div>数量</div>
        <VanButton
          v-if="displaySpecCount === 0"
          size="small" text="+加入清单" color="#f6d961" round
          @click="addHandle"
        />
        <CountControls v-else v-model:count="displaySpecCount" />
      </div>
    </div>

  </VanActionSheet>
</template>

<script setup>
import { useSpecAddHook } from './specAddHook'
import CountControls from './CountControls.vue'

const props = defineProps({
  productInfo: {type: Object, default: () => {}},
})

const {
  isShow, show, displaySpecList, subSpecClickHandle, isActive, displayUrl, viewImg,
  displaySelectedTxt, priceDisplay, isDisabled, displaySpecCount, addHandle
} = useSpecAddHook(props)

defineExpose({show})


</script>

<style lang="scss" scoped>
.com-sepc-add__content {
  padding: $pdH;
  max-height: 400px;
  overflow: auto;
  .head-content {
    display: flex;
    .img-wrap {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      overflow: hidden;
    }
    .price-info {
      margin-left: 10px;
      .price {
        color: $themeColor;
        .unit {
          font-size: 12px;
        }
        .count {
          font-size: 18px;
          font-weight: bold;
        }
      }
      .selected-spec {
        color: $grey8;
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
  .spec-list-wrap {
    margin-top: 10px;
    .spec-parent-item {
      margin-bottom: 15px;
      .parent-name {
        color: $grey7;
        font-size: 14px;
      }
      .child-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .child-item {
          padding: 3px 10px;
          box-sizing: border-box;
          border-radius: 5px;
          overflow: hidden;
          margin-right: 10px;
          margin-bottom: 7px;
          box-sizing: border-box;
          border:  1px solid $grey9;
          &.active {
            background: rgba(220, 108, 77, .3);
            color: $themeColor;
            border-color: $themeColor;
          }
          &.item__disabled {
            background: $bgGrey;
            color: $grey9;
            border-color: $grey9;
          }
        }
      }
    }
  }
  .count-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    border-top: 1px solid $bgGrey;
    padding-top: 10px;
    height: 45px;
    :deep(.van-button__text) {
      color: #000;
    }
  }
}
</style>