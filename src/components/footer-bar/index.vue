<template>
  <div class="com-footer-bar" v-if="isShow">
    <div class="item" :class="{active: [1,3].includes(status)}" @click="toProd">
      <VanIcon name="photo-o"/>
      <div>产品</div>
    </div>
    <div class="item" :class="{active: status === 2}" @click="toContact">
      <VanIcon name="user-o"/>
      <div>联系</div>
    </div>
    <div class="item" v-if="isShowCart" @click="toInventoryList">
      <VanIcon v-if="totalCount > 0" name="cart-o" :badge="totalCount" />
      <VanIcon v-else name="cart-o" />
      <div>清单</div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { shopCarInstance, globalData } from '@/store'

const route = useRoute()
const router = useRouter()
const {shopId} = route.params

const isShow = computed(() => {
  if (['product-manage', 'contact', 'mul-manage'].includes(route.name)) return true
  return false
})

const status = computed(() => {
  if (!isShow) return 0
  if (route.name === 'product-manage') return 1
  if (route.name === 'contact') return 2
  if (route.name === 'mul-manage') return 3
  return 0
})

const toProd = () => {
  if ([1, 3].includes(status.value)) return
  let query = {...route.query}
  let {from, id} = query
  from = +from
  delete query.from
  delete query.id
  if (from === 3) {
    router.replace({name: 'mul-manage',params:{shopId, id}, query})
  } else {
    router.replace({name: 'product-manage',params:{shopId}, query})
  }
  
}

const toContact = () => {
  if (status.value === 2) return
  const query = {...route.query, from: status.value}
  if (status.value === 3) {
    query.id = route.params.id
  }

  router.replace({name: 'contact', params: {shopId}, query})
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

const isShowCart = computed(() => {
  if (totalCount.value > 0) return true
  if (globalData.value.hasInventory) return true
  return false
})


</script>

<style lang="scss">
.com-footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: $footerBarH;
  background: $bgWhite;
  border-top: 1px solid #e3e3e3;
  box-sizing: border-box;
  display: flex;
  z-index: 0;
  // padding-top: 8px;
  .item {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    padding-top: 10px;
    // justify-content: center;
    font-size: $fsL;
    color: $grey;
    display: flex;
    flex-direction: column;
    .van-icon {
      font-size: 18px;
    }
    &.active{
      color: #3d8bf2;
    }
  }
}

</style>