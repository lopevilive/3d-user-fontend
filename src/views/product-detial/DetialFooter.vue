<template>
  <div class="view-com-detial-footer">
    <div class="left-content">
      <div class="content-item" @click="goback">
        <VanIcon name="revoke" class="bold" />
        <div class="bold">返回</div>
      </div>
      <div class="content-item" v-if="totalCount" @click="toInventoryList">
        <VanIcon name="cart-o" class="bold" />
        <div class="bold">清单</div>
        <div class="count">{{ totalCount }}</div>
      </div>
    </div>
    <div class="right-content">
       <AddControls :productInfo="productInfo" :mode="1" />
    </div>
  </div>

</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { shopCarInstance } from '@/store'
import AddControls from '@/components/add-controls/index.vue'

const props = defineProps({
  productInfo: {type: Object, default: () => {}},
})

const router = useRouter()

const goback = () => {
  router.go(-1)
}

const toInventoryList = () => {
  router.push({name: 'inventory-list'})
}

const shopCarList = shopCarInstance.getAllData()

const totalCount = computed(() => {
  let ret = 0
  for (const item of shopCarList.value) {
    ret += item.count
  }
  return ret
})

</script>

<style lang="scss" scoped>
.view-com-detial-footer {
  background: $bgWhite;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  // height: $footerBarH;
  height: $footerBarH;
  width: 100%;
  border-top: 1px solid $bgGrey;
  display: flex;
  justify-content: space-between;
  padding: 0 $pdH;
  .left-content {
    display: flex;
    height: 50px;
    .content-item {
      display: flex;
      align-items: center;
      margin-right: 30px;
      font-size: $fsL;
      color: $grey;
      font-size: 14px;
      .van-icon {
        font-size: 16px;
      }
      .count {
        padding: 2px 4px;
        background: #ec6443;
        border-radius: 10px;
        color: #fff;
        font-size: 10px;
        margin-left: 2px;
      }
    }
  }
  .right-content {
    height: 50px;
    display: flex;
    align-items: center;
    :deep(.van-button__text) {
      color: #000;
    }
  }
}

</style>