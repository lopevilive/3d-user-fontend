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
      <VanButton class="see-3d" icon="eye-o" text="查看3D效果" size="mini" @click="handleView3D"/>
    </div>
    <div class="name-share">
      <div class="name">{{ info.name }}</div>
      <VanButton size="small" icon="share-o" icon-position="right">分享</VanButton>
    </div>
    <div class="desc-content">
      <div class="desc-head">
        <div class="tit">产品参数</div>
      </div>
      <div class="desc-list">
        <div class="list-item" v-for="item in descDisplay">
          <div class="name">{{item.label}}：</div>
          <div class="desc">{{ item.val }}</div>
        </div>
      </div>
    </div>
    <ModelDisplay ref="modelDisplayRef" :productInfo="info"/>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import { useRoute } from 'vue-router'
import { getProduct } from '@/http/cgi.js'
import { commonFetch } from '@/util/index.js'
import {globalData} from '@/sotre/index.js'
import ModelDisplay from '@/components/model-display/index.vue'

const route = useRoute()
const {id: productId, shopId} = route.params

const modelDisplayRef = ref()

const info = ref({})

const productTypes = globalData.value.getProductTypes(shopId)

const imgList = computed(() => {
  const {url, imgs} = info.value
  if (!url && !imgs) return []
  let ret = []
  ret = [url]
  if (imgs) {
    ret = ret.concat(imgs.split(','))
  }
  return ret
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
  info.value = data?.[0] ?? info.value
}

init()
  
</script>

<style scoped lang="scss">
.view-product-detial {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .swipe {
    box-shadow: $shadow;
    width: 375px;
    height: 375px;
    position: relative;
    .see-3d {
      position: absolute;
      bottom: 10px;
      right: 10px;
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
    align-items: center;
    background: $bgWhite;
    .name {
      flex: 1;
      line-height: 20px;
      font-weight: bold;
      font-size: $fsH;
      display: flex;
    }
    .share {
      flex-shrink: 0;
    }
  }
  .desc-content {
    background: #fff;
    margin-top: $mrL;
    flex: 1;
    padding: $pdL $pdM;
    .desc-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: $pdL;
      .tit{
        color: $grey;
      }
    }
    .desc-list {
      .list-item {
        display: flex;
        align-items: center;
        border-top: 1px solid #e3e3e3;
        padding: $pdL 0;
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


