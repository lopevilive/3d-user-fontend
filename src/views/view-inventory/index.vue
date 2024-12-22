<template>
  <div class="view-view-inventory">
    报价单
    <VanButton text="转发给朋友" @click="toShare"/>
  </div>

</template>

<script setup>
import {isInApp} from '@/util'

const toShare = () => {
  const inApp = isInApp()
  if (!inApp) return
  wx.miniProgram.navigateTo({url: `../share-page/share-page`})
}


</script>

<style lang="scss" scoped>
.view-view-inventory {

}
</style>