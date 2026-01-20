<template>
  <div class="product-edit">
    <VanForm label-align="left" ref="formRef">
      <VanCellGroup>
        <!-- 产品图片 -->
         <MainImage v-model="data.url" />
        <!-- 产品描述 -->
        <Desc  v-model="data.desc"/>
      </VanCellGroup>
      <VanCellGroup>
        <!-- 产品分类 -->
        <ProdTypeSelect v-model="data.productType" v-model:isMulType="data.isMulType" />
      </VanCellGroup>
      <VanCellGroup>
        <!-- 产品价格 -->
        <PriceMod
          v-model:price="data.price"
          v-model:isSpec="data.isSpec"
          v-model:specDetials="data.specDetials"
          @resetValidation="handleResetValidation"
        />
      </VanCellGroup>
      <VanCellGroup>
        <AttrCfg v-model="data.attr" :attr-cfg="busiCfg.attrCfg"/>
      </VanCellGroup>
      <VanCellGroup>
        <!-- 上/下架 -->
        <StatusSelect v-model="data.status"/>
        <!-- 详情图 -->
        <DescImage v-model="data.descUrl" />
      </VanCellGroup>
    </VanForm>
    <QrcodeScanner ref="qrcodeScannerRef" @scan="scanHandle"/>
    <DialogVip ref="dialogVipRef" title="产品数量已达上限" />
    <SecCheck ref="secCheckRef" />
    <div class="bottom">
      <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
    </div>
  </div>
</template>

<script setup>
import {useProductEdit} from './hooks'
import QrcodeScanner from '@/components/qrcode-scanner/index.vue'
import ProdTypeSelect from '@/components/prod-type-select/index.vue'
import StatusSelect from './StatusSelect.vue'
import Desc from './Desc.vue'
import AttrCfg from './AttrCfg.vue'
import PriceMod from '@/components/price-mod/index.vue'
import DialogVip from '@/components/dialog-vip/index.vue'
import MainImage from './MainImage.vue'
import DescImage from './DescImage.vue'
import SecCheck from './SecCheck.vue'

const {
  data, formRef, saveHandle, init, qrcodeScannerRef, scanClickHandle, scanHandle,
  busiCfg, dialogVipRef, handleResetValidation, secCheckRef
} = useProductEdit()

init()



</script>

<script>
export default {
  name: 'ProductEdit'
}

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
    z-index: 10;
  }
}

</style>


