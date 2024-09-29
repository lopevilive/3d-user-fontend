
<template>
  <div class="view-type-manage">
    <VanSearch v-model="searchStr" placeholder="请输入分类名" @search="searchHandle" show-action @cancel="cancelHandle"/>
    <div class="tit">分类列表</div>
    <VanList :finished="true">
      <VanCell v-for="item in data" :key="item.id" :title="item.name">
         <div class="opt">
          <VanIcon name="edit" @click="editHandle(item)" />
          <VanIcon name="delete-o" @click="delHandle(item)"/>
        </div>
      </VanCell>
    </VanList>
    <div class="bottom-btn">
      <VanButton text="新增分类" block type="primary" native-type="submit" @click="addHandle"/>
    </div>
    <DialogEdit ref="dialogEditRef" @update="init"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductTypes, productTypesDel } from '@/http/cgi.js'
import { commonFetch } from '@/util/index.js'
import DialogEdit from './dialog-edit.vue'
import { showConfirmDialog } from 'vant';

const route = useRoute()
const dialogEditRef = ref()

const { shopId } = route.params

const searchStr = ref('')

const data = ref([])

const searchHandle = (val) => {
  console.log('search')
}

const cancelHandle = () => {
  console.log('cancel')
}

const editHandle = (item) => {
  dialogEditRef.value.show({...item})
}

const addHandle = () => {
  dialogEditRef.value.show({id: 0, name: ''})
}

const delHandle = async (item) => {
  try {
    await showConfirmDialog({
      title: '删除分类',
      message: `确定删除【${item.name}】?`
    })
    await commonFetch(productTypesDel, {id: item.id})
    init()
  } catch (error) {}
}

const init = async () => {
  const res = await commonFetch(getProductTypes, {shopId})
  data.value = res
}

init()

</script>

<style lang="scss" scoped>
.view-type-manage {
  background: $bgWhite;
  min-height: 100%;
  .tit {
    padding:0 $pdM;
    color: #528cb1;
  }
  .opt {
    font-size: 20px;
    :deep(.van-icon) {
      padding: 5px;
    }
    :deep(.van-icon-edit) {
      color: #528cb1;
    }
    :deep(.van-icon-delete-o) {
      color: red;
    }
  }
  .bottom-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: $pdH;
    box-sizing: border-box;
    background: $bgWhite;
  }
}


</style>