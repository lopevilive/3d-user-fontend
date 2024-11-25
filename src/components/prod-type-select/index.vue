<template>
  <VanField label="产品分类" readonly>
    <template #input>
      <div class="type-select">
        <div class="text" @click="showTypePicker = true">
          <div :class="{'none': !modelValue}">{{ productTypeDisplay }}</div>
          <div class="line">|</div>
        </div>
        <VanButton size="mini" type="primary" icon="plus" @click="showProductTypeDialog">新增</VanButton>
      </div>
    </template>
  </VanField>
  <Select v-model="val" :columns="productTypes" v-model:show="showTypePicker" />
  <ProductTypeDialog ref="productTypeDialogRef" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import Select from '@/components/select/index.vue'
import {globalData} from '@/store'

const props = defineProps({
  modelValue: {type: [Number, String]}
})
const emits = defineEmits(['update:modelValue'])

const route = useRoute()

const shopId = +route.params.shopId

const val = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    if (!val) val = ''
    emits('update:modelValue', val)
  }
})

const productTypeDialogRef = ref()

const showTypePicker = ref(false)

const productTypeDisplay = computed(() => {
  let {modelValue} = props
  if (!modelValue) return '点击选择分类'
  modelValue = +modelValue
  for (const item of productTypes.value) {
    if (item.value === modelValue) return item.text
  }
  return ''
})

const productTypes = computed(() => {
  const ret = globalData.value.productTypes.map((item) => ({text: item.name, value: item.id}))
  ret.splice(0,0, {text: '未分类', value: ''})
  return ret
})

const showProductTypeDialog = () => {
  productTypeDialogRef.value.show({id: 0, name: ''})
}



</script>

<style lang="scss" scoped>
.type-select {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 10px;
      .none {
        color: $greyPlaceholder;
      }
      .line {
        color: $greyPlaceholder;
      }
    }
  }

</style>