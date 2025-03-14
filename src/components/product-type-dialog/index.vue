<template>
  <VanDialog v-model:show="isShow" show-cancel-button :title="tit" :beforeClose="beforeClose">
    <template v-if="isMul">
      <VanField
        v-for="(item, index) in dataList"
        class="type-mod-dialog__field"
        :label="`${index + 1}.分类名称`"
        placeholder="请输入名称"
        v-model="item.name"
        :key="index + 1"
        :maxlength="8"
      />
      <div class="type-mod-dialog__tips">注：单次可新增 {{ MaxNums }} 个分类</div>
    </template>
    <VanField v-else placeholder="请输入分类名称" v-model="data.name" :maxlength="8" input-align="center"/>
  </VanDialog>
</template>

<script setup>
import {useDialogEdit} from './hook'

const emits = defineEmits(['update'])

const {
  show,
  isShow,
  tit,
  data,
  beforeClose,
  isMul,
  dataList,
  MaxNums
} = useDialogEdit(emits)

defineExpose({show})


</script>

<style lang="scss">
.type-mod-dialog__field {
  .van-field__label {
    width: 70px;
  }
}
.type-mod-dialog__tips {
  color: $greyPlaceholder;
  font-size: 12px;
  margin: $mrL $mrH;
}
</style>