<template>
  <div class="com-count-controls">
    <div class="tool" v-if="count > 0" @click="desHandle">
      <span>-</span>
    </div>
    <span class="count" v-if="count > 0 && mode === 0">{{ count }}</span>
    <div v-if="mode === 1">
      <VanField v-model="countDisplay" :maxlength="7" type="number" class="pd0" placeholder="请输入" input-align="center" />
    </div>
    <div class="tool" @click="addHandle">
      <span>+</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {type: Number, default: 0},
  mode: {type: Number, default: 0}
})

const emits = defineEmits(['update:count'])

const addHandle = () => {
  let count = props.count + 1
  emits('update:count', count)
}

const desHandle = () => {
  let count = props.count - 1
  emits('update:count', count)
}

const countDisplay = computed({
  get() {
    return props.count
  },
  set(val) {
    val = Number(val)
    if (val >= 0) {
      emits('update:count', val)
    }
  }
})

</script>

<style lang="scss" scoped>
.com-count-controls {
  display: flex;
  align-items: center;
  .tool {
    padding: 0 5px;
    span{
      background: #f6d961;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
  }
  .count {
    font-size: 12px;
  }
}
</style>

