<template>
  <VanField
    v-model="valDisplay"
    :required="true"
    label="产品描述"
    placeholder="描述一下产品的信息～"
    type="textarea"
    :maxlength="252"
    :rows="4"
    :clearable="true"
    :show-word-limit="isShowLimit"
    :rules="[{required: true, message: '产品描述不能为空'}]"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {type: String}
})

const emits = defineEmits(['update:modelValue'])

const isShowLimit = computed(() => {
  if (props.modelValue.length > 200) return true
  return false
})

const valDisplay = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    if (!val) val = ''
    val = val.trim()
    emits('update:modelValue', val)
  }
})



</script>

