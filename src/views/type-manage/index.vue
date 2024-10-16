
<template>
  <div class="view-type-manage">
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
    <ProductTypeDialog ref="dialogEditRef" @update="init"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getProductTypes, productTypesDel } from '@/http'
import { commonFetch } from '@/util'
import { showConfirmDialog } from 'vant';
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import {initProductTypes} from '@/store'

const route = useRoute()
const dialogEditRef = ref()

const { shopId } = route.params

const data = ref([])

const editHandle = (item) => {
  dialogEditRef.value.show({...item})
}

const addHandle = () => {
  dialogEditRef.value.show({id: 0, name: ''}, true)
}

const delHandle = async (item) => {
  try {
    await showConfirmDialog({
      title: '删除分类',
      message: `确定删除【${item.name}】?`
    })
    await commonFetch(productTypesDel, {id: item.id})
    initProductTypes()
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
    padding:$pdH $pdM 0 $pdM;
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