<template>
  <div class="view-album-mod">
    <VanForm label-align="right" ref="formRef">
      <VanCellGroup>
        <VanField label="Logo:" :required="true" :rules="[{required: true, message: 'logo 不能为空'}]">
          <template #input>
            <UploadImgs v-model="data.logo" :maxCount="1"/>
          </template>
        </VanField>
        <VanField
          v-model="data.name"
          label="名称:"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
        />
        <VanField
          v-model="data.desc"
          label="业务介绍:"
          :required="true" 
          placeholder="请输入介绍"
          :rules="[{required: true, message: '业务介绍不能为空'}]"
        />
      </VanCellGroup>
      <div class="bottom">
        <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
      </div>
    </VanForm>
  </div>
</template>


<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import {useAlbumMod} from './hook'


const {
  data,
  formRef,
  saveHandle,
  init
} = useAlbumMod()


init()


  
</script>

<style scoped lang="scss">
.view-album-mod {
  background: $bgWhite;
  :deep(.van-cell-group) {
    border-bottom: 1px solid #ebedf0;
    border-radius: 0;
    .van-field__label {
      width: 70px;
    }
  }
  .bottom {
    margin: 16px;
  }

}
</style>


