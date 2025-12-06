<template>
  <VanField
    readonly
    :rules="[{validator: validUrl}]"
  >
    <template #label>
      <FormLabel label="详情图" tips="tmp">
        <template #default>
          <div class="img-tips-wrap">
            可以拖动调整图片顺序。会员支持上传更多图片，
            <span class="to-vip" @click="goVip">前往了解</span>。
          </div>
        </template>
      </FormLabel>
      ({{imgCount}}/{{maxCount}})
    </template>
    <template #input>
      <UploadImgs v-model="displayUrl" :maxCount="maxCount" :maxSize="maxSize" ref="uploadImgsRef"/>
    </template>
  </VanField>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toVip, vipInfoManage } from '@/util'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { showToast } from 'vant'

const props = defineProps({
  modelValue: {type: String, default: ''},
})

const emits = defineEmits(['update:modelValue'])

const route = useRoute()
const shopId = +route.params.shopId

const vipInfo = ref()
const uploadImgsRef = ref()

const goVip = () => {
  toVip(shopId)
}

const validUrl = () => {
  if (uploadImgsRef.value.isLoading) {
    showToast('请等待图片上传完成再保存～')
    return '请等待图片上传完成再保存～'
  }
}

const displayUrl = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const imgCount = computed(() => {
  if (!props.modelValue) return 0
  return props.modelValue?.split?.(',')?.length || 0
})

const maxSize = computed(() => {
  if ([516, 1028, 1757].includes(shopId)) return 60 // 特殊逻辑
  const cfg = vipInfo.value?.cfg
  const level = vipInfo.value?.level
  if (!cfg) return 10
  const matchItem = cfg.find((item) => item.level === level)
  if (!matchItem) return 10
  return matchItem.descImgS || 10;
})

const maxCount = computed(() => {
  const cfg = vipInfo.value?.cfg
  const level = vipInfo.value?.level
  if (!cfg) return 3
  const matchItem = cfg.find((item) => item.level === level)
  return matchItem.descImgC || 3;
})

const init = async () => {
  const ret = await vipInfoManage.getData(shopId)
  vipInfo.value = ret[0]
}

init()

</script>

<style scoped lang="scss">
.img-tips-wrap {
  padding: 20px 10px;
  color: $grey7;
  font-size: $fsM;
  .to-vip {
    color: #3d8bf2;
  }
}

</style>