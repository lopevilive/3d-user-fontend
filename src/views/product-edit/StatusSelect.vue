<template>
  <VanField
    label="是否上架"
    placeholder="点击切换"
    v-model="valDisplay"
    @click="show = true"
    is-link
    :required="true"
    readonly
  >

  </VanField>
  <Select v-model="val" :columns="columns"  v-model:show="show"/>
</template>

<script setup>
import { ref, computed } from 'vue'
import Select from '@/components/select/index.vue'

const props = defineProps({
  modelValue: {type: Number}
})
const emits = defineEmits(['update:modelValue'])

const show = ref(false)

const columns = [
  {text: '上架', value: 0},
  {text: '下架', value: 1}
]

const val = computed({
  get(){
    return props.modelValue
  },
  set(val) {
    if (!val) val = 0
    emits('update:modelValue', val)
  }
})

const valDisplay = computed(() => {
  const {modelValue} = props
  for (const item of columns) {
    if (item.value === modelValue) return item.text
  }
  return ''
})


</script>