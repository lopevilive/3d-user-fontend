<template>
  <div class="view-home-mod">
    <ModuleConfigDialog ref="moduleConfigDialogRef" />
    <div class="cfg-list-list">
      <div
        class="cfg-item"
        v-for="(item, index) in enabledModules"
        :key="index"
      >
        <component
          :is="getComByName(item.comName)"
          @delete="data.cfg.find(m => m.comName === item.comName).status = 2"
        />
      </div>
    </div>
    <div class="bottom-wrap">
      <div class="bottom-left">
        <div class="switch-wrap">
          <div class="label-txt">启用</div>
          <VanSwitch />
        </div>
      </div>
      <div class="bottom-right">
        <div class="btn-group">
          <VanButton
            text="配置模块"
            size="small"
            plain
            @click="handleConfigModules"
          />
          <VanButton
            text="预览"
            size="small"
            plain
            type="primary"
          />
        </div>
        <VanButton
          text="保存配置"
          type="primary"
          size="small"
          class="save-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useHomeMod } from './hook'
import ModuleConfigDialog from './ModuleConfigDialog.vue'

const {
  data,
  getComByName,
  enabledModules,
  moduleConfigDialogRef,
  handleConfigModules
} = useHomeMod()

</script>

<style lang="scss" scoped>
.view-home-mod {
  padding-bottom: $footerBarH;
  .cfg-list-list {
    padding: $pdL;
    .cfg-item:not(:first-child) {
      margin-top: 10px;
    }
  }
  .bottom-wrap {
    height: $footerBarH;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    border-top: 1px solid $bgGrey;
    .bottom-left {
      display: flex;
      align-items: center;
      width: 30%;
      flex-shrink: 0;
      .switch-wrap {
        display: flex;
        align-items: center;
        .label-txt {
          margin-right: 10px;
        }
      }
    }
    .bottom-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 70%;
      .btn-group {
        display: flex;
        .van-button {
          margin-left: 10px;
        }
      }
      .save-btn {
        margin-left: 15px;
      }
    }
  }
}

</style>