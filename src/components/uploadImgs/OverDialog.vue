<template>
  <VanDialog
    v-model:show="isShow"
  >
    <div class="over-tips">
      当前最大支持上传 {{ maxSize }} M 的图片。
      <template v-if="shopId">
        会员支持上传大图，<span @click="goVip" class="to-vip">前往了解</span>。
      </template>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { toVip } from '@/util'

const route = useRoute()

const shopId = + route.params.shopId

const isShow = ref(false)
const maxSize = ref()

const show = async (m) => {
  maxSize.value = m
  isShow.value = true
}

const goVip = () => {
  if (shopId) toVip(shopId)
}


defineExpose({show})

</script>

<style scoped lang="scss">
.over-tips {
  color: $grey7;
  font-size: $fsM;
  padding: 20px 10px;
  .to-vip {
    color: #3d8bf2;
  }
}

</style>