<template>
  <div class="com-product-manage">
    <div>
      <div class="header">
        <div class="name">{{ shopInfo.name }}</div>
        <!-- <div class="search"></div> -->
      </div>
      <div class="tabs">
        <VanTabs v-model:active="activeTab">
          <VanTab v-for="item in productTypes" :key="item.id" :title="item.name"></VanTab>
        </VanTabs>
      </div>
    </div>
    <div class="product-content">
      <div class="wrap">
        <div class="list">
          <productItem v-for="item in prodcutList" :data="item" :key="item.id" @update="fetchProducts"/>
        </div>
      </div>
    </div>
    <Setting />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProduct, getShop } from '@/http/cgi.js'
import { commonFetch } from '@/util/index.js'
import { globalData } from '@/sotre/index.js'
import Setting from '@/components/setting/index.vue'
import productItem from './ProductItem.vue'

const route = useRoute()
const {shopId} = route.params

const prodcutList = ref([])
const shopInfo = ref({})
const activeTab = ref(0)
const productTypes = globalData.value.getProductTypes(shopId)

const fetchProducts = () => {
  commonFetch(getProduct, {shopId}).then((data) => {
    prodcutList.value = data || []
  })
}

const fetchShop = async () => {
  const res = await commonFetch(getShop, {shopId})
  if (res?.[0])shopInfo.value = res[0]
}

const init = async () => {
  fetchProducts()
  fetchShop()
}

init()

</script>

<style lang="scss" scoped>
.com-product-manage {
  height: 100%;
  background: $bgGrey;
  display: flex;
  flex-direction: column;
  .header {
    background: $bgWhite;
    height: 60px;
    .name {
      display: flex;
      justify-content: center;
      font-size: $fsB;
      padding: $pdH;
      position: relative;
    }
  }
  .tabs{
    padding: 0 $pdM;
    background: $bgWhite;
    margin-top: $mrL;
    :deep(.van-tabs__nav) {
      .van-tabs__line {
        width: 6px;
        height: 6px;
        background: #000;
        border-radius: 50%;
        opacity: 0.7;
      }
    }
  }
  .product-content {
    flex: 1;
    background: $bgWhite;
    padding: $pdL;
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    .wrap {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .list {
      position: absolute;
      // padding-bottom: 50px;
      box-sizing: border-box;
      width: 100%;
      max-height: 100%;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content:space-between;
      align-items:flex-start;
      padding: $pdL;
    }
  }
}

</style>