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
            <FormLabel label="产品图片" tips="tmp">
              <template #default>
                <div class="img-tips-wrap">
                  首张图片作为产品封面，可以拖动调整图片顺序。会员支持上传更多图片，
                  <span class="to-vip" @click="goVip">前往了解</span>。
                </div>
              </template>
            </FormLabel>
            ({{imgCount}}/{{ maxCount }})
          </template>
          <template #input>
            <UploadImgs v-model="data.url" :maxCount="maxCount" :maxSize="maxSize" ref="uploadImgsRef"/>
          </template>
        </VanField>
        <Desc  v-model="data.desc"/>
        <ProdTypeSelect v-model="data.productType" />
        <PriceMod
          v-model:price="data.price"
          v-model:isSpec="data.isSpec"
          v-model:specs="data.specs"
        />
        <StatusSelect v-model="data.status"/>
        
      </VanCellGroup>

      <VanCellGroup v-if="type3DOpts.length">
        <VanField>
          <template #label>
            <FormLabel label="720°全景" tips="tmp">
              <template #default>
                <div class="tips-content">
                  <div><span class="item">默认</span> - 系统将自动选择第一张图片，动态生成720°全景图像</div><br/>
                  <div><span class="item">扫二维码</span> - 如果您已经在酷家乐等软件中完成了720°全景图，可以通过扫描分享二维码在小程序内轻松打开</div>
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
    <QrcodeScanner ref="qrcodeScannerRef" @scan="scanHandle"/>
    <ModelDisplay ref="modelDisplayRef" :productInfo="data" />
    <DialogVip ref="dialogVipRef" title="产品数量已达上限" />
    <div class="bottom">
      <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
    </div>
  </div>
</template>

<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import Select from '@/components/select/index.vue'
import {useProductEdit} from './hooks'
import QrcodeScanner from '@/components/qrcode-scanner/index.vue'
import FormLabel from '@/components/form-label/index.vue'
import ProdTypeSelect from '@/components/prod-type-select/index.vue'
import StatusSelect from './StatusSelect.vue'
import ModelDisplay from '@/components/model-display/index.vue'
import Desc from './Desc.vue'
import AttrCfg from './AttrCfg.vue'
import PriceMod from '@/components/price-mod/index.vue'
import DialogVip from '@/components/dialog-vip/index.vue'

const {
  formRef,
  data,
  saveHandle,
  init,
  model3DDisplay,
  model3dOpts,
  showModel3d,
  validUrl,
  scanClickHandle,
  qrcodeScannerRef,
  scanHandle,
  type3DOpts,
  modelDisplayRef,
  preview3D,
  uploadImgsRef,
  busiCfg,
  maxCount,
  imgCount,
  maxSize,
  dialogVipRef,
  goVip
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
    background: $bgWhite;
  }
}

.img-tips-wrap {
  padding: 20px 10px;
  color: $grey7;
  font-size: $fsM;
  .to-vip {
    color: #3d8bf2;
  }
}

</style>


