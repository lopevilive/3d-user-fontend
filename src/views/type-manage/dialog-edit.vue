<template>
  <VanDialog v-model:show="isShow" show-cancel-button :title="tit" :beforeClose="beforeClose">
    <VanField placeholder="请输入分类名称" v-model="data.name" :maxlength="6" input-align="center"/>
  </VanDialog>
</template>

<script setup>
import {useDialogEdit} from './hooks'

const emits = defineEmits(['update'])

const {show, isShow, tit, data, beforeClose} = useDialogEdit(emits)

defineExpose({
  show
})


</script>

<style scoped lang="scss">

</style>