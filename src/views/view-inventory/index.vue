<template>
  <div class="view-view-inventory" v-if="info.add_time">
    <VanCell class="desc-item" title="收货地址" :label="info.address || '无'" >
      <template #value>
        <VanButton @click="copyStr(info.address)" text="复制地址" size="small" :disabled="!info.address"/>
      </template>
    </VanCell>
    <VanCell class="desc-item" title="备注" :label="info.remark" v-if="info.remark">
      <template #value>
        <VanButton @click="copyStr(info.remark)" text="复制备注" size="small" :disabled="!info.remark"/>
      </template>
    </VanCell>
    <div class="content-list">
      <div class="list-item" v-for="item in dataList">
        <div class="img"><VanImage :src="item.url" fit="cover"/></div>
        <div class="content">
          <div class="ellipsis">{{ item.desc }}</div>
          <div class="info-item" v-if="item.spec">
            <span class="tit">规格：</span>
            <VanTag type="primary" plain> {{ item.spec }}</VanTag>
          </div>
          <div class="price-content">
            <div class="info-item">
              <span class="tit">单价：</span>
              <span class="price-num">¥{{ item.price || '-' }}</span>
            </div>
            <div class="count">x {{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="inventory-info">
      <div>清单生成时间：{{ displayTime }}</div>
      <div>(注：清单最长保留半年)</div>
    </div>
     <div class="bottom-footer">
      <div class="left-content">
        <div class="item">
          <span class="tit">合计：</span>
          <span class="price-unit">¥</span>
          <span class="price">{{ info.totalPrice || '-' }}</span>
        </div>
        <div class="item">
          <span class="tit">数量：</span>
          <span>{{ info.totalCount }}</span>
        </div>
      </div>
      <div class="right-content">
        <VanButton text="转发清单"  type="primary" icon="share-o" @click="toShare"/>
      </div>
     </div>
  </div>
  <div v-else>
    <VanEmpty description="暂无数据" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { toSharePage, shopInfoManage, commonFetch, copyStr } from '@/util'
import { getInventory } from '@/http'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute()

const id = +route.params.id
const shopId = +route.params.shopId

const info = ref({})
const dataList = ref([])

const toShare = async () => {
  let src_path = route.fullPath
  src_path = src_path.replace(/(&)?toShare=1/, '')
  let shopInfo = await shopInfoManage.getShopInfo(shopId)
  shopInfo = shopInfo[0]
  toSharePage({
    src_path,
    url: shopInfo?.url?.split(',')?.[0] || '',
    title: '购物清单',
    desc1: [shopInfo?.name || ''],
    desc2: [displayTime.value],
    scene: { name: 'view-inventory', shopId, id},
    inventoryId: id
  })
}

const getInventoryData = async () => {
  let ret = await commonFetch(getInventory, {id})
  if (ret.length) {
    ret = ret[0]
    const tmp = JSON.parse(ret.data)
    info.value = {
      add_time: ret.add_time,
      id: ret.id,
      shopId: ret.shopId,
      address: tmp.address,
      remark: tmp.remark,
      totalCount: tmp.totalCount,
      totalPrice: tmp.totalPrice
    }
    dataList.value = tmp.list
  }
}

const init = async () => {
  await getInventoryData()
  if (route.query.toShare === '1') {
    toShare()
  }
}

const displayTime = computed(() => {
  if (!info.value.add_time) return '-'
  return dayjs(info.value.add_time * 1000).format('YYYY/MM/DD HH:mm')
})

init()


</script>

<style lang="scss" scoped>
.view-view-inventory {
  padding-bottom: $footerBarH;
  .desc-item {
    :deep(.van-cell__title) {
      width: 70%;
      flex-shrink: 0;
      flex: 0  1 auto;
    }
  }
  .list-item {
    background: $bgWhite;
    padding: 10px $pdH;
    margin-top: 1px;
    display: flex;
    .img {
      width: 60px;
      height: 60px;
      border-radius: 5px;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 10px;
      :deep(.van-image) {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      flex: 1;
      min-width: 0;
      .info-item {
        display: flex;
        margin-top: 5px;
        align-items: center;
        .tit {
          color: $grey7;
          flex-shrink: 0;
        }
      }
      .price-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .price-num {
          color: $red;
          word-break: break-all;
        }
        .count {
          flex-shrink: 0;
        }
      }
    }
  }
  .inventory-info {
    background: $bgWhite;
    margin-top: 2px;
    padding: 10px $pdH;
    font-size: 12px;
    color: $grey9;
  }
  .bottom-footer {
    height: $footerBarH;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    border-top: 1px solid $bgGrey;
    background: $bgWhite;
    display: flex;
    padding: 10px $pdH;
    justify-content: space-between;
    .left-content {
      .item {
        display: flex;
        margin-bottom: 5px;
        align-items: baseline;
        .tit {
          flex-shrink: 0;
        }
        .price-unit {
          color: $red;
        }
        .price {
          color: $red;
          font-size: 18px;
          font-weight: bold;
          word-break: break-all;
        }
      }
      .tit {
        color: $grey7;
      }
    }
    .right-content {
      flex-shrink: 0;
    }
  }
}
</style>