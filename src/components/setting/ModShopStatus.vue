<template>
  <VanDialog
    v-model:show="isShow" show-cancel-button
    @confirm="confirmHandle"
    title="修改状态"
  >
    <VanField label="类型" readonly @click="isShowSelect = true">
      <template #input>
        <div>{{ displayVal }}</div>
      </template>
    </VanField>
    <Select v-model="selectVal" v-model:show="isShowSelect" :columns="selectOpts"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { commonFetch} from '@/util'
import { modShopStatus } from '@/http'
import {showSuccessToast} from 'vant'
import Select from '@/components/select/index.vue'
import { computed } from 'vue'

const route = useRoute()
const shopId = +route.params.shopId

const isShow = ref(false)
const isShowSelect = ref(false)

const selectVal = ref(1)
const selectOpts = [
  {text: '放过', value: 1},
  {text: '持续审核', value: 2},
  {text: '封禁', value: 3},
  {text: '解封画册', value: 4}
]

const displayVal = computed(() => {
  for(const item of selectOpts) {
    if (item.value === selectVal.value) return item.text
  }
  return ''
})

const getPayload = () => {
  let status = 0
  let auditing = 0
  if (selectVal.value === 1) {
    status = 0
    auditing = 99
  }
  if (selectVal.value === 2) {
    status = 0
    auditing = 2
  }
  if (selectVal.value === 3) {
    status = 1
    auditing = 2
  }
  if (selectVal.value === 4) {
    status = 0
    auditing = 0
  }
  return {shopId, status, auditing}
}

const confirmHandle = async () => {
  await commonFetch(modShopStatus, getPayload())
  showSuccessToast('修改成功～')
}

const show = async () => {
  isShow.value = true
}

defineExpose({show})

</script>
