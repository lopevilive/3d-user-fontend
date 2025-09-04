<template>
  <VanField
    v-model="displayUrl"
    :required="true"
    :rules="[{validator: validUrl}]"
    readonly
  >
    <template #label>
      <FormLabel label="产品图片" tips="tmp">
        <template #default>
          <div class="img-tips-wrap">
            首张图片作为产品封面，可以拖动调整图片顺序。会员支持上传更多图片，
            <span class="to-vip" @click="goVip">前往了解</span>。
          </div>
        </template>
      </FormLabel>
      ({{imgCount}}/{{ maxCount }})
    </template>
    <template #input>
      <UploadImgs v-model="displayUrl" :maxCount="maxCount" :maxSize="maxSize" ref="uploadImgsRef"/>
    </template>
  </VanField>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { showToast } from 'vant'
import { toVip, vipInfoManage } from '@/util'

const props = defineProps({
  modelValue: {type: String, default: ''},
})

const emits = defineEmits(['update:modelValue'])

const route = useRoute()
const shopId = +route.params.shopId

const vipInfo = ref()
const uploadImgsRef = ref()

const displayUrl = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  }
})

const maxCount = computed(() => {
  const cfg = vipInfo.value?.cfg
  const level = vipInfo.value?.level
  if (!cfg) return 6
  const matchItem = cfg.find((item) => item.level === level)
  return matchItem.imgC
})

const maxSize = computed(() => {
  if ([516].includes(shopId)) return 40 // 特殊逻辑
  const cfg = vipInfo.value?.cfg
  const level = vipInfo.value?.level
  if (!cfg) return 10
  const matchItem = cfg.find((item) => item.level === level)
  if (!matchItem) return 10
  return matchItem.imgS;
})

const imgCount = computed(() => {
  if (!props.modelValue) return 0
  return props.modelValue?.split?.(',')?.length || 0
})

const validUrl = async (value, rule) => {
  if (!props.modelValue) return '图片不能为空'
  if (uploadImgsRef.value.isLoading) {
    showToast('请等待图片上传完成再保存～')
    return '请等待图片上传完成再保存～'
  }
  
  return true
}

const goVip = () => {
  toVip(shopId)
}

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