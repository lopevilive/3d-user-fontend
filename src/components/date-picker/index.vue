<template>
  <div class="com-date-picker" @click="clickHandle">
    <div :class="{'text-grey': !modelValue, 'text-dark': modelValue}">{{ dateDisplay }}</div>
  </div>
  <VanPopup v-model:show="isShow" position="bottom" teleport="body">
    <VanDatePicker
      :modelValue="dataValue"
      @confirm="confirmHandle"
      @cancel="cancelHandle"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </VanPopup>
</template>

<script setup>
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  modelValue: {type: String, default: ''},
  minDate: {type: Object, default: () => dayjs('2024-01-01').toDate()},
  maxDate: {type: Object, default: () => new Date()}
})

const emits = defineEmits(['update:modelValue'])

const isShow = ref(false)

const dateDisplay = computed({
  get() {
    if (!props.modelValue) return '请选择'
    const t = Number(props.modelValue)
    if (!t) return '请选择'
    return dayjs(t).format('YYYY-MM-DD')
  }
})

const dataValue = computed(() => {
  let t = Number(props.modelValue)
  if (!t) t = dayjs().valueOf()
  return dayjs(t).format('YYYY-MM-DD').split('-')
})

const cancelHandle = () => {
  isShow.value = false
}

const confirmHandle = ({ selectedValues }) => {
  // selectedValues 通常是 ['2024', '01', '01']
  const dateStr = selectedValues.join('-') // 拼接成 "2024-01-01"
  const time = dayjs(dateStr).valueOf()    // 获取毫秒级时间戳
  emits('update:modelValue', String(time))
  isShow.value = false
}

const clickHandle = async () => {
  isShow.value = true
}

</script>

<style lang="scss" scoped>
.com-date-picker {
  .text-grey {
    color: $grey9;
  }
  .text-dark {
    color: $grey6;
  }
}

</style>