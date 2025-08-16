<template>
  <div class="view-com-common-use-specs" v-if="specsCfg.length">
    <div class="common-head">
      <div>最近使用</div>
      <!-- <VanButton text="管理" plain type="primary" size="small"/> -->
    </div>
    <div class="common-list">
      <div class="list-item" v-for="item in specsCfg">
        <VanButton
          :text="item.name" icon="plus" size="mini" :disabled="item.disabled"
          @click="clickHandle(item)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommonUseSpecs } from './commonUseSpecsHook'

const props = defineProps({
  isSpec: {type: Number},
  singleSpecs: {type: Array, default: () => []},
  mulSpecs: {type: Array, default: () => []},
})

const emits = defineEmits(['add'])

const {
  init, specsCfg, clickHandle
} = useCommonUseSpecs(props, emits)

init()


</script>

<style lang="scss" scoped>
.view-com-common-use-specs {
  padding:$pdM $pdM;
  border-bottom: 1px solid $bgGrey;
  .common-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .common-list {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -10px;
    max-height: 80px;
    overflow: auto;
    .list-item {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
}

</style>