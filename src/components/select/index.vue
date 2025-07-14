<template>
  <VanPopup v-model:show="showDisplay" position="bottom" teleport="body">
    <VanPicker
      :columns="columns"
      @cancel="showDisplay = false"
      @confirm="confirmHandle"
    />
  </VanPopup>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  modelValue: {type: [String, Number], default: ''},
  columns: {type: Array, default: () => []}, // {text: '', value: xx}
  show: {type: Boolean, default: false}
})

const emits = defineEmits(['update:modelValue', 'update:show'])

const confirmHandle = (val) => {
  const {selectedValues} = val
  showDisplay.value = false
  const ret = selectedValues?.[0] || null
  emits('update:modelValue', ret)
}

const showDisplay = computed({
  get(){
    return props.show
  },
  set(val) {
    emits('update:show', val)
  }
})

</script>