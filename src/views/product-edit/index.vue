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
            <UploadImgs v-model="data.url" :maxCount="6" ref="uploadImgsRef"/>
          </template>
        </VanField>
        <Desc 
          v-model="data.desc"
        />
        <!-- <VanField
          v-model="data.name"
          label="产品名称"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
          readonly
        >
          <template #input>
            <div class="flex1" >
              <VanField
                v-model="data.name"
                class="pd0"
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
        </VanField> -->
        <VanField
          v-model="data.price"
          label="产品价格"
          placeholder="请输入价格"
          type="digit"
        />
        <ProdTypeSelect v-model="data.productType" />
        <StatusSelect v-model="data.status"/>
        
      </VanCellGroup>

      <VanCellGroup v-if="type3DOpts.length">
        <VanField>
          <template #label>
            <FormLabel label="720°全景" tips="tmp">
              <template #default>
                <div class="tips-content">
                  <div><span class="item">默认</span> - 系统将自动选择第一张图片，动态生成720°全景图像。</div><br/>
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
            readonly
            :required="true"
            :rules="[{required: true, message: '不能为空'}]"
          >
            <template #input>
              <div class="model-default">
                <VanField
                  class="pd0 flex1"
                  placeholder="点击选择场景"
                  @click="showModel3d = true"
                  readonly
                  v-model="model3DDisplay"
                  :border="false"
                />
                <div class="line">|</div>
                <VanButton v-if="model3DDisplay" @click="preview3D" text="预览" icon="eye-o" size="mini" type="primary"/>
              </div>
            </template>
          </VanField>
          <Select v-model="data.model3D" :columns="model3dOpts" v-model:show="showModel3d"  />
        </template>
        <template v-if="data.type3D === 2 && type3DOpts.length">
          <VanField label="场景地址" :required="true" :rules="[{required: true, message: '地址不能为空'}]" v-model="data.modelUrl" readonly>
            <template #input>
              <div class="model-url">
                <VanField class="pd0 flex1" placeholder="请扫描二维码或输入地址" v-model="data.modelUrl" :border="false"/>
                <div class="line">|</div>
                <VanIcon name="scan" class="iconBtn" @click="scanClickHandle" />
                <VanIcon name="delete-o" class="iconBtn" @click="data.modelUrl = ''" />
                <VanButton v-if="data.modelUrl" @click="preview3D" class="preview" text="预览" icon="eye-o" size="mini" type="primary"/>
              </div>
            </template>
          </VanField>
        </template>
      </VanCellGroup>

      <VanCellGroup>
        <AttrCfg v-model="data.attr" :attr-cfg="busiCfg.attrCfg"/>
      </VanCellGroup>
    </VanForm>
    <ProductTypeDialog ref="productTypeDialogRef"/>
    <QrcodeScanner ref="qrcodeScannerRef" @scan="scanHandle"/>
    <ModelDisplay ref="modelDisplayRef" :productInfo="data" />
    <div class="bottom">
      <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
    </div>
  </div>
</template>

<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import Select from '@/components/select/index.vue'
import {useProductEdit} from './hooks'
import ProductTypeDialog from '@/components/product-type-dialog/index.vue'
import QrcodeScanner from '@/components/qrcode-scanner/index.vue'
import FormLabel from '@/components/form-label/index.vue'
import ProdTypeSelect from '/Users/crushcaca/Desktop/pro/user-font-end/src/components/prod-type-select/index.vue'
import StatusSelect from './StatusSelect.vue'
import ModelDisplay from '@/components/model-display/index.vue'
import Desc from './Desc.vue'
import AttrCfg from './AttrCfg.vue'

const {
  formRef,
  data,
  saveHandle,
  init,
  model3DDisplay,
  model3dOpts,
  showModel3d,
  validUrl,
  productTypeDialogRef,
  scanClickHandle,
  qrcodeScannerRef,
  scanHandle,
  type3DOpts,
  recommendNames,
  isFocusName,
  isShowRecommendNames,
  nameBlurHandle,
  modelDisplayRef,
  preview3D,
  uploadImgsRef,
  busiCfg
} = useProductEdit()

init()



</script>

<style scoped lang="scss">
.product-edit {
  background: $bgGrey;
  padding-bottom: $footerBarH;
  :deep(.van-cell-group) {
    margin-bottom: $mrL;
    .model-default {
      display: flex;
      width: 100%;
      .line {
        color: $greyPlaceholder;
        margin:0 10px;
      }
    }
    .model-url {
      display: flex;
      flex: 1;
      .line {
        color: $greyPlaceholder;
        margin:0 10px;
      }
      .preview {
        margin-left:5px;
      }
      .iconBtn {
        font-size: 20px;
        padding: 2px 3px;
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
        border-radius: 3px;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }
  .bottom {
    height: $footerBarH;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding: 0 $pdH;
    padding-top: 8px;
    box-sizing: border-box;
  }
}

</style>


