<template>
  <div class="view-view-inventory" v-if="info.add_time">
    <div class="order-wrap">
      <div class="left">
        <span>清单号：{{ info.orderId }}</span>
      </div>
      <div class="right">
        <VanButton text="复制" size="small" @click="copyStr(info.orderId)" />
      </div>
    </div>
    <div class="order-wrap" v-if="[2,3,99].includes(globalData.rid)">
      <div class="left">
        <span>清单状态：</span>
        <VanTag type="primary" v-if="info.status === 0">待处理</VanTag>
        <VanTag type="success" v-if="info.status === 1">已完成</VanTag>
        <VanTag color="#6e7071" v-if="info.status === 2">已取消</VanTag>
      </div>
      <div class="right" v-if="[2,3,99].includes(globalData.rid)">
        <VanButton v-if="[0,1].includes(info.status)" @click="cancelHandle" text="取消清单" size="small" type="warning"/>
        <VanButton v-if="[0,2].includes(info.status)" @click="finishHandle" text="完成清单" size="small" type="success"/>
      </div>

    </div>
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
      <div class="list-item" v-for="item in dataList" @click="goDetial(item.id)">
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
        <VanButton text="转发清单" type="primary" icon="share-o" @click="toShare"/>
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
import { getInventory, modInventoryStatus } from '@/http'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { globalData } from '@/store'
import { showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()

const id = +route.params.id
const shopId = +route.params.shopId

const info = ref({})
const dataList = ref([])

const getExportStatus = (shopInfo) => {
  if ([2,3,99].includes(globalData.value.rid)) return ''
  if (shopInfo.inveExportStatus === 1) return '1'
  if (shopInfo.forwardPermi === 1) return '1'
  return ''
}

const toShare = async () => {
  let src_path = route.fullPath
  src_path = src_path.replace(/(&)?toShare=1/, '')
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0]
  toSharePage({
    src_path,
    url: shopInfo?.url?.split(',')?.[0] || '',
    title: '购物清单',
    desc1: [shopInfo?.name || ''],
    desc2: [displayTime.value],
    scene: { name: 'view-inventory', shopId, id},
    inventoryId: id,
    noExport: getExportStatus(shopInfo)
  })
}

const getInventoryData = async () => {
  let ret = await commonFetch(getInventory, {id})
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0]
  ret = ret?.[0]
  if (!ret) return false // 清单不存在了
  if (shopInfo.forwardPermi === 1) { // 限制转发图册的时候，只有创建者或者管理员能打开清单
    const {rid, userInfo: {userId}} = globalData.value
    if (![2,3,99].includes(rid)) { // 非管理员
      if (ret.userId !== userId) { // 不是本人打开清单
        return false
      }
    }
  }

  const tmp = JSON.parse(ret.data)
  info.value = {
    ...ret,
    address: tmp.address,
    remark: tmp.remark,
    totalCount: tmp.totalCount,
    totalPrice: tmp.totalPrice
  }
  dataList.value = tmp.list
}

const cancelHandle = async () => {
  await showConfirmDialog({message: '确定取消该清单？'})
  await commonFetch(modInventoryStatus, {shopId, id, status: 2})
  globalData.value.inventoryNeedExec.push(id)
  getInventoryData()
}

const finishHandle = async () => {
  await showConfirmDialog({message: '确定完成该清单？'})
  await commonFetch(modInventoryStatus, {shopId, id, status: 1})
  globalData.value.inventoryNeedExec.push(id)
  getInventoryData()
}

const displayTime = computed(() => {
  if (!info.value.add_time) return '-'
  return dayjs(info.value.add_time * 1000).format('YYYY/MM/DD HH:mm')
})

const goDetial = (id) => {
  router.push({name: 'product-detial', params: {id}})
}

const init = async () => {
  const ret = await getInventoryData()
  if (ret === false) {
    router.replace({name: 'home'})
    return
  }
  if (route.query.toShare === '1') {
    toShare()
  }
}

init()


</script>

<style lang="scss" scoped>
.view-view-inventory {
  padding-bottom: $footerBarH;
  .order-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $bgWhite;
    border-bottom: 1px solid $bgGrey;
    padding: 5px 16px;
    .left {
      font-size: 12px;
      color: $grey8;
      .van-tag {
        margin-left: 5px;
      }
    }
    .right {
      .van-button {
        margin-left: 10px;
      }
    }
  }
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
    .left {
      font-size: 12px;
    }
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
      flex: 1;
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
      .van-button {
        margin-left: 5px;
      }
    }
  }
}
</style>