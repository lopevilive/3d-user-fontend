<template>
  <div class="view-home-mod">
    <ModuleConfigDialog ref="moduleConfigDialogRef" />
    <!-- 顶部固定区域 -->
    <div class="top-fixed-wrap">
      <div class="top-left">
        <div class="switch-wrap">
          <div class="label-txt">是否启用</div>
          <VanSwitch v-model="enAbledDisplay" />
          <div class="tips">(需保存后生效)</div>
        </div>
      </div>
      <div class="top-right">
        <VanButton text="预览" size="small" plain type="primary" @click="toPreview" />
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="content-wrap">
      <div class="cfg-list-list">
        <div
          class="cfg-item"
          v-for="(item, index) in data.cfg"
          :key="index"
          v-show="item.status ===  1"
        >
          <component
            :is="COMPONENT_MAP[item.comName]"
            @delete="data.cfg.find(m => m.comName === item.comName).status = 2"
            v-model:config="item.info"
          />
        </div>
      </div>
      <div class="module-btn">
        <VanButton text="添加模块" size="small" plain @click="handleConfigModules" />
      </div>
    </div>
    <!-- 底部固定区域 -->
    <div class="bottom-wrap">
      <VanButton text="保存配置" type="primary" block @click="saveHandle" />
    </div>
  </div>
</template>

<script setup>
import { useHomeMod } from './hook'
import ModuleConfigDialog from './ModuleConfigDialog.vue'

const {
  data, moduleConfigDialogRef, handleConfigModules, COMPONENT_MAP, enAbledDisplay, saveHandle,
  toPreview
} = useHomeMod()

</script>

<style lang="scss" scoped>
.view-home-mod {
  padding-top: 60px; // 为顶部固定区域留出空间
  padding-bottom: $footerBarH;
  
  .top-fixed-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background: $bgWhite;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $pdH;
    box-sizing: border-box;
    border-bottom: 1px solid $bgGrey;
    
    .top-left {
      display: flex;
      flex-direction: column;
      
      .switch-wrap {
        display: flex;
        align-items: center;
        .tips {
          font-size: 12px;
          color: $grey8;
          margin-left: 5px;
        }
        .label-txt {
          margin-right: 10px;
        }
      }
      
    }
    
    .top-right {
      display: flex;
      align-items: center;
    }
  }
  
  .content-wrap {
    .cfg-list-list {
      padding: $pdL;
      
      .cfg-item:not(:first-child) {
        margin-top: 10px;
      }
    }
    .module-btn {
      padding: 0 $pdL $pdL $pdL;
    }
  }
  
  .bottom-wrap {
    height: $footerBarH;
    position: fixed;
    background: $bgWhite;
    z-index: 10;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    border-top: 1px solid $bgGrey;
    padding-bottom: 15px;
  }
}

</style>