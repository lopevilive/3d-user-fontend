<template>
  <VanDialog
    v-model:show="isShow" show-cancel-button
    @confirm="confirmHandle"
  >
    <VanField
      label="level:"
      placeholder="请输入level"
      v-model="level"
    />
    <VanField
      label="年:"
      placeholder="请输入年"
      v-model="year"
    />
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { commonFetch} from '@/util'
import { modShopStatus } from '@/http'
import {showSuccessToast} from 'vant'

const route = useRoute()
const shopId = +route.params.shopId

const isShow = ref(false)

const level = ref(1)
const year = ref(1)

const confirmHandle = async () => {
  const l = Number(level.value)
  const y = Number(year.value)
  let expiredTime = Math.floor(Date.now() / 1000)
  expiredTime += y * (12 * 30 + 10 ) * 24 * 60 * 60
  const payload = {shopId,level: l, expiredTime}
  await commonFetch(modShopStatus, payload)
  showSuccessToast('升级成功～')
}

const show = async () => {
  isShow.value = true
}

defineExpose({show})

</script>
