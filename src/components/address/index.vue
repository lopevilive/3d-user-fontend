<template>
  <div class="com-address">
    <div class="wrap" @click="toAddress">
      <div class="icon">
        <VanIcon name="location-o" />
      </div>
      <div class="address-content">
        <div class="tit">收货地址（选填）</div>
        <div class="desc">点击此处填写收货信息</div>
      </div>
      <div class="arrow">
        <VanIcon name="arrow"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toAddress = () => {
  router.push({name: 'address-list'})
}

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
      .tit {
        font-size: 16px;
        font-weight: bold;
      }
      .desc {
        font-size: 12px;
        color: $grey9;
        margin-top: 5px;
      }
    }
    .arrow {
      flex-shrink: 0;
    }
  }
}
</style>