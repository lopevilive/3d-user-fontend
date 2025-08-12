<template>
  <VanActionSheet
    :actions="actions"
    cancel-text="取消"
    v-model:show="isShow"
    close-on-click-action
    @select="selectHandle"
    @cancel="cancelHandle"
    @click-overlay="cancelHandle"
  />
</template>

<script setup>
import { ref } from 'vue'


const actions = ref([])
const isShow = ref(false)

let resolve = null
let reject = null

const selectHandle = (actionItem) => {
  const { type } = actionItem
  resolve(type)
}

const cancelHandle = () => {
  console.log(999999)
  reject(null)
}

const getAction = async (idx, list) => {
  const ac = [{name: '编辑', type: 'edit'}]
  if (idx !== 0 && list.length >= 2) ac.push({name: '前移', type: 'moveTop'})
  let len = list.length
  if  ((idx + 1) !== len &&  len >= 2) ac.push({name: '后移', type: 'moveDown'})
  ac.push({name: '删除', type: 'del'})
  actions.value = ac
  isShow.value = true
  const p = new Promise((r, s) => {
    resolve = r
    reject = s
  })
  return p
}

defineExpose({getAction})

</script>