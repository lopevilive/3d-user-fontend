<template>
  <VanActionSheet
    v-model:show="isShow"
    cancel-text="取消"
    teleport="body"
    :actions="actions"
    @select="onSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import { posMap } from './hook'

const isShow = ref(false)

let resolve
let reject

const show = () => {
  isShow.value = true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

const actions = []

const keys = Object.keys(posMap)
for (const item of keys) {
  actions.push({
    name: posMap[item],
    value: item
  })
}

const onSelect = (action) => {
  isShow.value = false
  resolve(action.value)
}

defineExpose({show})

</script>