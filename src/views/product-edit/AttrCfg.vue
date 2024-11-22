<template>
  <div class="viewcom-attrcfg">
    <div class="list">
      <div class="list-item" v-for="(item, index) in renderList" :key="item.name">
        <div class="name">{{ item.name }}</div>
        <div class="otps">
          <div class="opt-content" :ref="(ret) => {optContentRefs[index] = ret}">
            <div
              class="opt-item"
              :class="{'item__active': item.val === opt}"
              v-for="opt in item.displayOpts"
              @click="optClickHandle(item, opt)"
            >{{ opt }}</div>
            <VanButton
              class="custom"
              size="mini"
              type="primary"
              icon="edit"
              @click="customOptHandle(item)"
            >自定义</VanButton>
          </div>
        </div>
      </div>
      <VanButton size="mini" type="primary" icon="plus" @click="customKeyHandle" >新增一行</VanButton>
    </div>
  </div>
  <CustomKey ref="customKeyRef" :attrList="renderList" @update="customUpdate" @del="customDelHandle"/>
  <CustomOpts ref="customOptsRef" @update="customOptsUpdate"/>

</template>

<script setup>
import {useAttrCfgHook} from './attrCfgHook'
import CustomKey from './CustomKey.vue'
import CustomOpts from './CustomOpts.vue'

const props = defineProps({
  modelValue: {type: String},
  attrCfg: {type: Array, default: () => []}
})

const emits = defineEmits(['update:modelValue'])

const {
  renderList,
  optClickHandle,
  customKeyHandle,
  customOptHandle,
  customKeyRef,
  customUpdate,
  customDelHandle,
  customOptsRef,
  customOptsUpdate,
  optContentRefs
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
      border-right: 1px solid $greyPlaceholder;
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