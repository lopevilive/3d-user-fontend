<template>
  <VanDialog 
    title="配置首页模块" 
    v-model:show="isShow" 
    show-cancel-button
    :beforeClose="beforeClose"
  >
    <div class="module-config-dialog">
      <div class="module-list">
        <div 
          class="module-item" 
          v-for="module in allModules" 
          :key="module.id"
          @click="toggleModule(module)"
        >
          <VanCheckbox :model-value="isSelected(module)" />
          <span>{{ module.name }}</span>
        </div>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant';

const isShow = ref(false)
const tempCfg = ref([])
const allModules = ref([
  { id: 'banner', name: '轮播图模块', comName: 'ItemBanner' },
  { id: 'productType', name: '产品分类模块', comName: 'ItemProductType' },
  { id: 'customProduct', name: '热门产品模块', comName: 'ItemCustomProduct' },
  { id: 'homeDesc', name: '店铺详情模块', comName: 'ItemHomeDesc' }
])

const isSelected = (module) => {
  return tempCfg.value.some(item =>
    item.comName === module.comName && item.status === 1
  )
}

const toggleModule = (module) => {
  const index = tempCfg.value.findIndex(item => item.comName === module.comName)
  
  if (index === -1) {
    tempCfg.value.push({ comName: module.comName, info: {}, status: 1 })
  } else {
    tempCfg.value[index].status = tempCfg.value[index].status === 1 ? 2 : 1
  }
}

let resolve = null
let reject = null

const beforeClose = (action) => {
  if (action === 'cancel') {
    reject(null)
    return true
  }
  
  if (tempCfg.value.filter(item => item.status === 1).length === 0) {
    showToast('请至少选择一个模块')
    return false
  }
  
  resolve([...tempCfg.value])
  return true
}

const show = async (currentCfg) => {
  tempCfg.value = JSON.parse(JSON.stringify(currentCfg))
  isShow.value = true
  return new Promise((a, b) => {
    resolve = a
    reject = b
  })
}

defineExpose({ show })
</script>

<style lang="scss" scoped>
.module-config-dialog {
  padding: 16px;
  
  .module-list {
    .module-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      
      .van-checkbox {
        margin-right: 12px;
      }
    }
  }
}
</style>