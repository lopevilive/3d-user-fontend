<template>
  <VanDialog
    teleport="body"
    v-model:show="isShow"
    show-cancel-button
    confirmButtonText="新增属性"
    cancelButtonText="取消"
    :beforeClose="beforeClose"
  >
    <div class="viewcom-custom-key">
      <div class="list">
        <div class="list-item" v-for="item in displayList">
          <div class="name">{{ item.name }}</div>
          <VanButton text="删除" type="danger" size="mini" icon="delete-o" @click="delHandle(item)"/>
        </div>
      </div>
      <div>
        <VanField 
          placeholder="请输入属性名称"
          v-model="val"
          :maxlength="8"
        />
      </div>

    </div>
  </VanDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast, showConfirmDialog} from 'vant';

const props = defineProps({
  attrList: {type: Array, default: () => []}
})

const emits = defineEmits(['update', 'del'])

const isShow = ref(false)
const val = ref('')

const show = () => {
  isShow.value = true
  val.value = ''
}

const displayList = computed(() => {
  let ret = []
  for (const item of props.attrList){
    if (item.isCustom) ret.push(item)
  }
  return ret
})

const beforeClose = async (action) => {
  if (action === 'cancel') return true
  let value = val.value?.trim?.() || ''
  if (!value) {
    showToast('属性名称不能为空')
    return false
  }
  for (const item of props.attrList) {
    if (item.name === value) {
      showToast('该属性已存在')
      return false
    }
  }
  emits('update', {name: value})
  return true
}

const delHandle = async (data) => {
  await showConfirmDialog({
    message: `确定要删除【${data.name}】吗？`
  })
  emits('del', data)
}

defineExpose({show})

</script>

<style lang="scss">
.viewcom-custom-key {
  padding: $pdH;
  .list {
    padding-bottom: 5px;
    max-height: 150px;
    overflow: auto;
  }
  .list-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 $pdH;
    padding-bottom: 10px;
    .name {
      color: $grey8;
    }
    &:last-child{
      border-bottom: 1px solid $grey9;
    }
  }
}
</style>
