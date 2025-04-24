<template>
  <div class="com-sort-control" @click="clickHandle">
    <span>{{ name }}</span>
    <div class="icon-wrap">
      <VanIcon class="up-icon" name="arrow-up" :class="{active: modelValue === 1}" />
      <VanIcon class="down-icon" name="arrow-down" :class="{active: modelValue === 2}" />
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['update:modelValue', 'change'])

const props = defineProps({
  name: {type: String},
  modelValue: {type: Number, default: 0}, // 0-不排序、1-升序、2-降序
})

const clickHandle = () => {
  let newVal
  if (props.modelValue === 0) newVal = 1
  if (props.modelValue === 1) newVal = 2
  if (props.modelValue === 2) newVal = 0

  emits('update:modelValue', newVal)
  emits('change', newVal)
}

</script>

<style lang="scss" scoped>
.com-sort-control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #646566;
  .icon-wrap {
    display: flex;
    flex-direction: column;
    font-size: 10px;
    .up-icon {
      position: relative;
      top: 2px;
    }
    .down-icon {
      position: relative;
      top: -2px;
    }
    .active {
      font-weight: bold;
      color: $themeColor;
    }
  }
}

</style>