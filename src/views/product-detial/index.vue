<template>
  <div class="view-product-detial">
    <div class="swipe" >
      <VanSwipe>
        <VanSwipeItem v-for="item in imgList">
          <div class="swipe-item">
            <VanImage fit="contain" :src="item" />
          </div>
        </VanSwipeItem>
      </VanSwipe>
      <VanButton v-if="[1,2].includes(info.type3D)" class="see-3d" icon="eye-o" text="查看3D效果" size="mini" @click="handleView3D"/>
    </div>
    <div class="name-share">
      <div class="left">
        <div class="name">{{ info.name }}</div>
        <div class="price" v-if="info.price">¥ {{ info.price }}</div>
      </div>
      <VanButton size="small" icon="share-o" icon-position="right">分享</VanButton>
    </div>
    <div class="desc-content">
      <div class="desc-list">
        <div class="list-item" v-for="item in descDisplay">
          <div class="name">{{item.label}}：</div>
          <div class="desc">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <ModelDisplay ref="modelDisplayRef" :productInfo="info"/>
    <Setting :runtimeData="info" />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/http'
import { commonFetch } from '@/util'
import {globalData} from '@/store'
import ModelDisplay from '@/components/model-display/index.vue'
import Setting from '@/components/setting/index.vue'

const route = useRoute()
const {id: productId, shopId} = route.params

const modelDisplayRef = ref()

const info = ref({})

const productTypes = globalData.value.getProductTypes(shopId)

const imgList = computed(() => {
  const {url} = info.value
  if (!url) return []
  return url.split(',')
})

const descDisplay = computed(() => {
  let ret = []
  for (const key of Object.keys(info.value)) {
    let val = info.value[key]
    if (!val) continue;
    if (key === 'desc') {
      ret.push({label: '产品描述', val})
    }
    if (key === 'productType') {
      val = +val
      for (const item of productTypes.value) {
        if (item.id === val) {
          ret.push({label: '产品类别', val: item.name})
        }
      }
    }
  }
  return ret
})

const handleView3D = () => {
  modelDisplayRef.value.showModelDisplay()
}


const init = async () => {
  if (!productId) return
  const data = await commonFetch(getProduct, {productId})
  if (data.list.length) {
    info.value = data.list[0]
  }
}

onMounted(init)

</script>

<script>
export default {
  name: 'ProductDetial'
}
</script>

<style scoped lang="scss">
.view-product-detial {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .swipe {
    width: 375px;
    height: 375px;
    position: relative;
    background: $bgWhite;
    .see-3d {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    :deep(.van-swipe__indicator) {
      opacity: 1;
    }
  }
  .swipe-item {
    width: 375px;
    height: 375px;
    :deep(.van-image) {
      width: 100%;
      height: 100%;
    }
  }
  .name-share {
    padding: $pdM;
    display: flex;
    background: $bgWhite;
    margin-top: 1px;
    .left {
      margin-right: $mrL;
      flex: 1;
    }
    .name {
      line-height: 20px;
      font-weight: bold;
      font-size: $fsH;
    }
    .price {
      color: $red;
      font-size: $fsH;
      font-weight: bold;
      margin-top: $mrL;
    }
    .share {
      flex-shrink: 0;
    }
  }
  .desc-content {
    margin-top: $mrL;
    flex: 1;
    .desc-list {
      .list-item {
        display: flex;
        border-bottom: 1px solid #e3e3e3;
        padding: $pdL 0;
        padding: $pdL $pdM;
        background: $bgWhite;
        .name {
          width: 70px;
          flex-shrink: 0;
          text-align: right;
        }
        .desc {
          flex: 1;
          color: $grey;
        }
        
      }
    }
  }
}

</style>


