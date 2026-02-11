<template>
  <div class="view-home-mod">
    <ModuleConfigDialog ref="moduleConfigDialogRef" />
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
    <div class="bottom-wrap">
      <div class="bottom-left">
        <div class="switch-wrap">
          <div class="label-txt">是否启用</div>
          <VanSwitch v-model="enAbledDisplay" />
        </div>
        <div class="tips">(需启用后才生效)</div>
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
          <VanButton
            text="保存配置"
            type="primary"
            size="small"
            @click="saveHandle"
          />
        </div>
        <div class="space"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHomeMod } from './hook'
import ModuleConfigDialog from './ModuleConfigDialog.vue'

const {
  data, moduleConfigDialogRef, handleConfigModules, COMPONENT_MAP, enAbledDisplay, saveHandle
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
    background: $bgWhite;
    z-index: 10;
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
      flex: 1;
      flex-shrink: 0;
      flex-direction: column;
      .switch-wrap {
        display: flex;
        align-items: center;
        .label-txt {
          margin-right: 10px;
        }
      }
      .tips {
        font-size: 12px;
        padding: 3px 0px 10px 0px;
        color: $grey9;
      }
    }
    .bottom-right {
      display: flex;
      width: 60%;
      flex-direction: column;
      .btn-group {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .van-button:not(:first-child) {
          margin-left: 10px;
        }
      }
      .space {
        height: 29.5px;
      }
    }
  }
}

</style>