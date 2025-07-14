<template>
  <Select v-model="valDisplay" :columns="columns" v-model:show="isShow" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Select from '@/components/select/index.vue'

const val = ref(0)
let resolve = null

const valDisplay = computed({
  get() {
    return val.value
  },
  set(v) {
    resolve(Number(v))
  }
})

const isShow = ref(false)

const columns = [
  {text: '上方', value: '0'},
  {text: '左侧', value: '1'}
]

const getTypeSide = () => {
  const p = new Promise((a, b) => {
    resolve = a
  })
  isShow.value = true
  return p
}

defineExpose({getTypeSide})

</script>