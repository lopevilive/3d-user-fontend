<template>
  <div class="com-count-controls">
    <div class="tool" v-if="count > 0" @click="desHandle">
      <span>-</span>
    </div>
    <span class="count" v-if="count > 0" @click="clickHandle">{{ count }}</span>
    <div class="tool" @click="addHandle">
      <span>+</span>
    </div>
    <InputDialog ref="inputDialogRef" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import InputDialog from '@/components/input-dialog/index.vue'

const props = defineProps({
  count: {type: Number, default: 0},
})

const emits = defineEmits(['update:count'])

const inputDialogRef = ref()

const addHandle = () => {
  let count = props.count + 1
  emits('update:count', count)
}

const desHandle = () => {
  let count = props.count - 1
  emits('update:count', count)
}

const clickHandle = async () => {
  const ret = await inputDialogRef.value.getVal(props.count, {title: '修改数量', validFn: (str) => {
    if (!/^\d+$/.test(str)) return '请输入数字'
    const val = Number(str)
  }})
  const count = Number(ret)
  emits('update:count', count)
}

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
    width: 30px;
    text-align: center;
  }
}
</style>

