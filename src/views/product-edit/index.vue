<template>
  <div class="product-edit">
    <VanForm label-align="right" label-width="70" ref="formRef">
      <VanCellGroup>
        <VanField
          label="产品图片:"
          v-model="data.url"
          :required="true"
          :rules="[{validator: validUrl, message: '图片不能为空'}]"
          readonly
        >
          <template #input>
            <UploadImgs v-model="data.url" />
          </template>
        </VanField>
        <VanField
          v-model="data.name"
          label="产品名称:"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
        />
        <VanField
          v-model="data.price"
          label="产品价格:"
          placeholder="请输入价格"
        />
        <VanField
          v-model="productTypeDisplay"
          label="产品分类:"
          @click="showTypePicker = true"
          placeholder="点击选择分类"
          is-link
          readonly
        />
        <Select v-model="data.productType" :columns="productTypes" v-model:show="showTypePicker" />
        <VanField
          v-model="data.desc"
          label="产品介绍:"
          rows="2"
          :autosize="true"
          show-word-limit
          maxlength="100"
          type="textarea"
          placeholder="请输入说明"
        />
        <VanField label="3D场景:">
          <template #input>
            <VanRadioGroup direction="horizontal" v-model="data.type3D">
              <vanRadio v-for="item in E_3D_TYPES" :name="item.key">{{ item.val }}</vanRadio>
            </VanRadioGroup>
          </template>
        </VanField>
        <template v-if="data.type3D === 1">
          <VanField
            v-model="model3DDisplay"
            label="场景类型:"
            placeholder="点击选择场景"
            @click="showModel3d = true"
            is-link
            readonly
          />
          <Select v-model="data.model3D" :columns="model3dOpts" v-model:show="showModel3d"  />
        </template>
        <template v-if="data.type3D === 2">
          <VanField label="地址:" :required="true" :rules="[{required: true, message: '地址不能为空'}]" v-model="data.modelUrl" readonly>
            <template #input>
              <div class="model-url">
                <VanField placeholder="请扫描二维码或输入地址" v-model="data.modelUrl"/>
                <VanButton icon="scan" size="small"/>
                <VanButton icon="delete-o" size="small" @click="data.modelUrl = ''"/>
              </div>
            </template>
          </VanField>
        </template>
      </VanCellGroup>
      <div style="margin: 16px;">
        <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
      </div>
    </VanForm>
  </div>
</template>

<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import Select from '@/components/select/index.vue'
import { E_3D_TYPES } from '@/util'
import {useProductEdit} from './hooks'

const {
  showTypePicker,
  formRef,
  productTypes,
  data,
  productTypeDisplay,
  saveHandle,
  init,
  model3DDisplay,
  model3dOpts,
  showModel3d,
  validUrl
}  = useProductEdit()

init()



</script>

<style scoped lang="scss">
.product-edit {
  background: $bgWhite;
  :deep(.van-cell-group) {
    border-bottom: 1px solid #ebedf0;
    border-radius: 0;
    .model-url {
      display: flex;
      justify-content: space-between;
      flex: 1;
      .van-cell {
        padding: 0;
      }
      .van-button {
        border: none;
        font-size: 18px;
      }
    }
  }
}

</style>


