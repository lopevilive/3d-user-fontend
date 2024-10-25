<template>
  <div class="product-edit">
    <VanForm label-align="left" ref="formRef">
      <VanCellGroup>
        <VanField
          v-model="data.url"
          :required="true"
          :rules="[{validator: validUrl, message: '图片不能为空'}]"
          readonly
        >
          <template #label>
            <FormLabel label="产品图片" tips="首张图片作为产品封面，支持拖动调整图片顺序。"/>
          </template>
          <template #input>
            <UploadImgs v-model="data.url" :maxCount="6"/>
          </template>
        </VanField>
        <VanField
          v-model="data.name"
          label="产品名称"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
          readonly
        >
          <template #input>
            <div class="field-no-padding" >
              <VanField
                v-model="data.name"
                placeholder="请输入名称"
                :border="false"
                @focus="isFocusName = true"
                @blur="nameBlurHandle"
              />
              <div class="recommend-names" v-if="isShowRecommendNames">
                <div class="recommend-content">
                  <div
                    v-for="item in recommendNames"
                    class="item"
                    @click="data.name = item"
                  >{{ item }}</div>
                </div>
              </div>
            </div>
          </template>
        </VanField>
        <VanField
          v-model="data.price"
          label="产品价格"
          placeholder="请输入价格"
        />
        <VanField label="产品分类" readonly>
          <template #input>
            <div class="type-select">
              <div class="text" @click="showTypePicker = true">
                <div :class="{'none': !data.productType}">{{ productTypeDisplay }}</div>
                <div class="line">|</div>
              </div>
              <VanButton size="mini" type="primary" icon="plus" @click="showProductTypeDialog">新增</VanButton>
            </div>
          </template>
        </VanField>
        <Select v-model="data.productType" :columns="productTypes" v-model:show="showTypePicker" />
      </VanCellGroup>

      <VanCellGroup v-if="type3DOpts.length">
        <VanField>
          <template #label>
            <FormLabel label="720°全景" tips="tmp">
              <template #default>
                <div class="tips-content">
                  <div><span class="item">默认</span> - 系统将自动选择第一张作为封面图，并动态生成720°全景图。</div>
                  <div><span class="item">扫二维码</span> - 如果您已经在酷家乐等软件中完成了720°全景图，可以通过扫描分享二维码在小程序内轻松打开。</div>
                </div>
              </template>
            </FormLabel>

          </template>
          <template #input>
            <VanRadioGroup direction="horizontal" v-model="data.type3D">
              <vanRadio v-for="item in type3DOpts" :name="item.key">{{ item.val }}</vanRadio>
            </VanRadioGroup>
          </template>
        </VanField>
        <template v-if="data.type3D === 1 && type3DOpts.length">
          <VanField
            v-model="model3DDisplay"
            label="场景类型"
            placeholder="点击选择场景"
            @click="showModel3d = true"
            is-link
            readonly
            :required="true"
            :rules="[{required: true, message: '地址不能为空'}]"
          />
          <Select v-model="data.model3D" :columns="model3dOpts" v-model:show="showModel3d"  />
        </template>
        <template v-if="data.type3D === 2 && type3DOpts.length">
          <VanField label="场景地址" :required="true" :rules="[{required: true, message: '地址不能为空'}]" v-model="data.modelUrl" readonly>
            <template #input>
              <div class="model-url">
                <VanField placeholder="请扫描二维码或输入地址" v-model="data.modelUrl"/>
                <VanButton icon="scan" size="small" @click="scanClickHandle" />
                <VanButton icon="delete-o" size="small" @click="data.modelUrl = ''"/>
              </div>
            </template>
          </VanField>
        </template>
      </VanCellGroup>
      
      <VanCellGroup>
        <VanField
          v-model="data.desc"
          label="产品介绍"
          rows="2"
          show-word-limit
          maxlength="100"
          type="textarea"
          placeholder="请输入说明"
        />
      </VanCellGroup>
      <div class="bottom">
        <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
      </div>
    </VanForm>
    <ProductTypeDialog ref="productTypeDialogRef"/>
    <QrcodeScanner ref="qrcodeScannerRef" @scan="scanHandle"/>
  </div>
</template>

<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import Select from '@/components/select/index.vue'
import {useProductEdit} from './hooks'
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import QrcodeScanner from '@/components/qrcode-scanner/index.vue'
import FormLabel from '@/components/form-label/index.vue'

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
  validUrl,
  productTypeDialogRef,
  showProductTypeDialog,
  scanClickHandle,
  qrcodeScannerRef,
  scanHandle,
  type3DOpts,
  recommendNames,
  isFocusName,
  isShowRecommendNames,
  nameBlurHandle
} = useProductEdit()

init()



</script>

<style scoped lang="scss">
.product-edit {
  background: $bgGrey;
  :deep(.van-cell-group) {
    margin-bottom: $mrL;
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
    .van-field__label {
      width: 84px;
    }
    .recommend-names {
      width: 100%;
      margin-top: 10px;
      height: 40px;
      position: relative;
      .recommend-content {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
      }
      .item {
        background: $bgGrey2;
        color: $grey7;
        height: 24px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        margin-right: 10px;
        border-radius: 20px;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }
  .type-select {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .text {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 10px;
      .none {
        color: $greyPlaceholder;
      }
      .line {
        color: $greyPlaceholder;
      }
    }
  }
  .bottom {
    margin: 16px;
  }
}

</style>


