<template>
  <div class="com-footer-bar" v-if="isShow">
    <div class="item" :class="{active: status === 1}" @click="toProd">
      <VanIcon name="photo-o"/>
      <div>产品</div>
    </div>
    <div class="item" :class="{active: status === 2}" @click="toContact">
      <VanIcon name="user-o"/>
      <div>联系</div>
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()
const {shopId} = route.params

const isShow = computed(() => {
  if (['product-manage', 'contact'].includes(route.name)) return true
  return false
})

const status = computed(() => {
  if (!isShow) return 0
  if (route.name === 'product-manage') return 1
  if (route.name === 'contact') return 2
  return 0
})

const toProd = () => {
  if (status.value === 1) return
  router.replace({name: 'product-manage',params:{shopId}, query: route.query})
}

const toContact = () => {
  if (status.value === 2) return
  router.replace({name: 'contact', params: {shopId}, query: route.query})
}

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
    width: 50%;
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