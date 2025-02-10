<template>
  <VanFloatingBubble
    class="record-float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offset"
    @click="clickHandle"
    v-if="isShow"
  >
    <div class="content">
      <!-- <VanIcon name="orders-o"/> -->
       <span class="txt">历史</span>
      <span class="txt">记录</span>
    </div>
  </VanFloatingBubble>
  <VanDialog title="历史清单" v-model:show="isShowDialog" confirmButtonText="关闭">
    <div class="inventory-dialog-list">
      <div class="list-item" v-for="item in inventoryList" @click="toViewInventory(item)">
        <div>创建时间：{{ dayjs(item.add_time * 1000).format('YYYY/MM/DD HH:mm') }}</div>
      </div>
      <div class="bottom-tips">(注：仅显示最近 {{ limit }} 条记录)</div>
    </div>
  </VanDialog>
</template>

<script setup>
import {ref, computed} from 'vue'
import { getFlexW, commonFetch } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import { getInventory } from '@/http'
import { globalData } from '@/store'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const shopId = + route.params.shopId

const gap = getFlexW(24)
const offset = ref({ x: getFlexW(375 - 24 - 40), y: window.innerHeight * 0.7});
const limit = 5

const inventoryList = ref([])

const clickHandle = async () => {
  isShowDialog.value = true
}

const isShow = computed(() => {
  if (inventoryList.value.length) return true
  return false
})

const isShowDialog = ref(false)

const toViewInventory = (item) => {
  router.push({name: 'view-inventory', params: {id: item.id}, query: {title: '购物清单'}})
}

const init = async () => {
  const {userInfo: {userId}} = globalData.value
  if (!userId) return
  const data = await commonFetch(getInventory, {shopId, userId, limit})
  inventoryList.value = data
}

init()

</script>

<style lang="scss">
.record-float {
  width: 40px;
  height: 40px;
  opacity: .8;
  background: $grey9;
  .content {
    // font-size: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .txt {
      font-size: 10px;
    }
  }
}
.inventory-dialog-list {
  .list-item {
    display: flex;
    justify-content: center;
    padding: 8px 0;
    color: #5794f7;
  }
  .bottom-tips {
    text-align: center;
    font-size: 12px;
    color: $grey9;
    padding-bottom: 10px;
  }
}
</style>