<template>
  <div class="com-address">
    <div class="wrap" @click="toAddress">
      <div class="icon">
        <VanIcon name="location-o" />
      </div>
      <div class="address-content">
        <div class="tit ellipsis">{{ displayTit }}</div>
        <div class="desc ellipsis">{{ displayDesc }}</div>
      </div>
      <div class="arrow">
        <VanIcon name="arrow"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { globalData } from '@/store'
import { shopInfoManage } from '@/util'

const router = useRouter()
const route = useRoute()

const shopId = + route.params.shopId

const shopInfo = ref({})

const toAddress = () => {
  router.push({name: 'address-list'})
}

const displayTit = computed(() => {
  const { selectedAddress, addressList } = globalData.value
  const currAddress = addressList.find((item) => selectedAddress.includes(item.id))
  if (currAddress) {
    return `${currAddress.name} ${currAddress.tel}`
  }
  let ret = '收货信息'
  if (shopInfo.value.addressStatus === 0) ret += '（选填）'
  return ret
})

const displayDesc = computed(() => {
  const { selectedAddress, addressList } = globalData.value
  const currAddress = addressList.find((item) => selectedAddress.includes(item.id))
  if (!currAddress) return '点击此处填写收货信息'
  return currAddress.addressDetail || ''
})

const displayAddressList = computed(() => {
  return globalData.value.addressList
})

watch(displayAddressList, (list) => {
  const {selectedAddress} = globalData.value
  if (selectedAddress.length) return
  for (const item of list) {
    if (item.isDefault) {
      globalData.value.selectedAddress = [item.id]
    }
  }
})

const init = async () => {
  let info = await shopInfoManage.getData(shopId)
  shopInfo.value = info[0]
}

init()

</script>

<style lang="scss" scoped>
.com-address {
  background: $bgWhite;
  .wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px $pdH;
    .icon {
      font-size: 24px;
      color: $themeColor;
      flex-shrink: 0;
    }
    .address-content {
      flex: 1;
      padding: 0 $pdM;
      min-width: 0;
      .tit {
        font-size: 16px;
        font-weight: bold;
        width: 100%;
      }
      .desc {
        font-size: 12px;
        color: $grey9;
        margin-top: 5px;
        width: 100%;
      }
    }
    .arrow {
      flex-shrink: 0;
    }
  }
}
</style>