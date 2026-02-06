<template>
  <VanDialog
    title=""
    v-model:show="isShow"
    show-cancel-button
    :beforeClose="beforeClose"
    class="module-config-dialog-wrapper"
  >
    <div class="module-config-dialog">
      <div class="module-list">
        <div
          class="module-item"
          v-for="module in allModules"
          :key="module.id"
          @click="toggleModule(module)"
        >
          <VanIcon :name="module.icon" size="20px" />
          <span>{{ module.name }}</span>
          <VanCheckbox :model-value="isSelected(module)" />
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
  { id: 'banner', name: '轮播图模块', comName: 'ItemBanner', icon: 'photo' },
  { id: 'productType', name: '产品分类模块', comName: 'ItemProductType', icon: 'apps-o' },
  { id: 'customProduct', name: '热门产品模块', comName: 'ItemCustomProduct', icon: 'fire' },
  { id: 'homeDesc', name: '店铺详情模块', comName: 'ItemHomeDesc', icon: 'manager' }
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
.module-config-dialog-wrapper :deep(.van-dialog__header) {
  padding: 16px 16px 0 16px;
  display: none;
}

.module-config-dialog {
  padding: 16px;
  
  .module-list {
    .module-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: #f8f8f8;
      }
      
      .van-icon {
        color: #1989fa;
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      span {
        flex: 1;
        color: #333;
        font-size: 16px;
      }
      
      .van-checkbox {
        margin-left: 12px;
      }
    }
    
    .module-item:last-child {
      border-bottom: none;
    }
  }
}

/* 为对话框添加圆角和阴影效果 */
.module-config-dialog-wrapper :deep(.van-dialog) {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>