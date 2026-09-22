<template>
  <div class="view-mul-manage">
    <div class="content">
      <div ref="leftListRef" class="list-item">
        <productItem v-for="item in leftList" :data="item" :key="item.id" />
      </div>
      <div ref="rightListRef" class="list-item">
        <productItem v-for="item in rightList" :data="item" :key="item.id" />
      </div>
    </div>
  </div>
</template>


<script setup>
import { useMulManage } from './hook'
import productItem from '@/components/product-item/index.vue'
import {onBeforeUnmount} from 'vue'
import {globalData} from '@/store'

const {
  leftList,
  rightList,
  leftListRef,
  rightListRef
} = useMulManage()

onBeforeUnmount(() => {
  globalData.value.mulManageId = 0
})

</script>

<script>
export default {
  name: 'MulManage'
}
</script>

<style lang="scss" scoped>
.view-mul-manage {
  padding-bottom: 100px;
  .content {
    box-sizing: border-box;
    width: 100%;
    max-height: 100%;
    overflow: auto;
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    justify-content:space-between;
    align-items:flex-start;
  }
  
  .list-item {
    width: 50%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

</style>