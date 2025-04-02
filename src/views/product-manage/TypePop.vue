<template>
  <VanPopup
    position="top" :style="{ height: '40%' }" v-model:show="isShow" :close-on-click-overlay="false"
    @click-overlay="overlayHandle"
  >
    <div class="view-com-type-pop">
      <div class="list-wrap">
        <div class="list-item" @click="itemClick(item)" v-for="item in productTypes" :class="{'item__active': item.id === activeId}">
          {{ item.name }}
        </div>
      </div>
    </div>
  </VanPopup>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  productTypes: {type: Array, default: () => []},
  activeId: {type: Number}
})

const isShow = ref(false)

let resolve
let reject

const show = async () => {
  isShow.value = true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

const itemClick = (item) => {
  isShow.value = false
  resolve(item.id)
}

const overlayHandle = () => {
  isShow.value = false
  reject()
}

defineExpose({show})

</script>

<style lang="scss">
.view-com-type-pop {
  height: 100%;
  overflow: auto;
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    padding: $pdM;
  }
  .list-item {
    padding: 10px;
    background: $bgGrey;
    margin-bottom: 10px;
    margin-right: 10px;
    &.item__active {
      color: $themeColor;
      background: #fbf2ec;
    }
  }
}
</style>