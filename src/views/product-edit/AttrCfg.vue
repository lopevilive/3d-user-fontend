<template>
  <div class="viewcom-attrcfg">
    <div class="list">
      <div class="list-item" v-for="item in renderList" :key="item.name">
        <div class="name">{{ item.name }}</div>
        <div class="otps">
          <div class="opt-content">
            <div
              class="opt-item"
              :class="{'item__active': item.val === opt}"
              v-for="opt in item.displayOpts"
              @click="optClickHandle(item, opt)"
            >{{ opt }}</div>
            <VanButton class="custom" size="mini" type="primary" icon="edit" @click="customHandle">自定义</VanButton>
          </div>
        </div>
      </div>
      <VanButton size="mini" type="primary" icon="plus" >自定义属性</VanButton>
    </div>
  </div>

</template>

<script setup>
import {useAttrCfgHook} from './attrCfgHook'

const props = defineProps({
  modelValue: {type: String},
  attrCfg: {type: Array, default: () => []}
})

const emits = defineEmits(['update:modelValue'])

const {
  renderList,
  optClickHandle,
  customHandle
} = useAttrCfgHook(props,emits)

</script>

<style lang="scss" scoped>
.viewcom-attrcfg {
  .list {
    padding: $pdM;
  }
  .list-item {
    display: flex;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
    .name {
      width: 80px;
      // text-align: right;
      flex-shrink: 0;
    }
    .otps {
      display: flex;
      flex: 1;
      position: relative;
      height: 100%;
      margin-left: $mrM;
      .opt-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }
      .opt-item {
        flex-shrink: 0;
        padding: 5px 10px;
        background: $bgGrey;
        margin-right: $mrL;
        border-radius: 5px;
      }
      .item__active {
        background: #f8e66e;
        font-weight: bold;
      }
      .custom {
        flex-shrink: 0;
      }
    }
  }
}

</style>