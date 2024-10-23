<template>
  <div class="view-album-mod">
    <VanForm label-align="left" ref="formRef">
      <VanCellGroup>
        <VanField :required="true" :rules="[{validator: () => !!data.url, message: '相册不能为空'}]">
          <template #label>
            <FormLabel label="公司相册" tips="首张图片作为图册 logo，支持拖动调整图片顺序。"/>
          </template>
          <template #input>
            <UploadImgs v-model="data.url" :maxCount="6"/>
          </template>
        </VanField>
        <VanField
          v-model="data.name"
          label="相册名称"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
        />
        <VanField
          :required="true"
          is-link
        >
          <template #label>
            <FormLabel label="所在地区" tips="选择您的所在地区，以便客户了解您的位置和服务范围。"/>
          </template>
          <template #input>
            <div class="field-no-padding" >
              <VanField readonly placeholder="请选择所在地域" v-model="data.area" @click="areaClick"/>
            </div>
          </template>
        </VanField>
        <!-- 请在创建图册时填写您的所在地区，以便客户了解您的位置和服务范围。 -->
        <AreaSelect ref="areaSelectRef" v-model="data.area"/>
        <VanField
          v-model="data.desc"
          :required="true" 
          placeholder="请输入介绍"
          type="textarea"
          show-word-limit
          maxlength="200"
          rows="2"
          :rules="[{required: true, message: '业务介绍不能为空'}]"
        >
        <template #label>
          <FormLabel label="业务介绍" tips="填写您的业务范围，以便更好地展示贵司的核心服务和产品，帮助客户快速了解您的专业领域。"/>
        </template>
        </VanField>
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
import AreaSelect from '@/components/area-select/index.vue'
import FormLabel from '@/components/form-label/index.vue'


const {
  data,
  formRef,
  saveHandle,
  init,
  areaSelectRef,
  areaClick
} = useAlbumMod()


init()


  
</script>

<style scoped lang="scss">
.view-album-mod {
  background: $bgWhite;
  :deep(.van-cell-group) {
    margin-bottom: $mrL;
    .van-field__label {
      width: 84px;
    }
  }
  .bottom {
    margin: 16px;
  }

}
</style>


