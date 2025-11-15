<template>
  <div class="view-com-common-use-specs" v-if="specsCfg.length">
    <div class="common-head">
      <div>最近使用</div>
      <VanButton text="管理" plain type="primary" size="small" @click="handleHistory"/>
    </div>
    <div class="common-list">
      <div class="list-item" v-for="item in specsCfg">
        <VanButton
          :text="item.name" icon="plus" size="mini" :disabled="item.disabled"
          @click="clickHandle(item)"
        />
      </div>
    </div>
    <VanDialog
      v-model:show="isShow" show-cancel-button
      title="最近使用" confirmButtonText="保存"  cancelButtonText="取消"
      :beforeClose="beforeClose"
    >
      <div class="history-mod-wrap">
        <div class="list-wrap">
          <div class="list-item" v-for="item in dialogList">
            <div class="item-name ellipsis">{{ item }}</div>
            <div class="ctr">
              <VanIcon name="delete-o" class="del-btn" @click="delHandle(item)"/>
            </div>
          </div>
          <VanEmpty v-if="dialogList.length === 0" description="暂无数据" :image-size="0" />
        </div>
      </div>
    </VanDialog>
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
  init, specsCfg, clickHandle, isShow, handleHistory, dialogList, delHandle, beforeClose
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
.history-mod-wrap {
  .list-wrap {
    max-height: 250px;
    overflow: auto;
    padding: 10px 0;
    min-height: 134px;
    .list-item {
      display: flex;
      justify-content: space-between;
      padding: $pdL $pdH;
      border-bottom: 1px solid #f5f5f5;
      .item-name {
        flex: 1;
        font-size: 14px;
      }
      .ctr {
        width: 30px;
        flex-shrink: 0;
        margin-left: 10px;
      }
      .del-btn {
        font-size: 20px;
        color: red;
      }
    }
  }
}

</style>