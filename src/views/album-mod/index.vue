<template>
  <div class="view-album-mod">
    <VanForm label-align="left" ref="formRef" v-if="!loading">
      <VanCellGroup>
        <VanField :required="true" :rules="[{validator: () => !!data.url, message: '不能为空'}]">
          <template #label>
            <FormLabel label="图册封面" tips="首张图片作为图册 logo，支持拖动调整图片顺序"/>
          </template>
          <template #input>
            <UploadImgs ref="uploadImgsRef" v-model="data.url" :maxCount="5"/>
          </template>
        </VanField>

        <VanField
          v-model="data.name"
          label="图册名称"
          :required="true"
          placeholder="请输入公司名称/图册名称"
          :maxlength="20"
          required
          :rules="[{validator: valiName}]"
        />

        <!-- <VanField is-link >
          <template #label>
            <FormLabel label="所属行业" :tips="businessTips"/>
          </template>
          <template #input>
            <div class="flex1" >
              <VanField class="pd0" readonly placeholder="请选择所属行业" v-model="businessDisplay" @click="businessClick" />
            </div>
          </template>
        </VanField>
        <Select v-model="data.business" :columns="businessOpts" v-model:show="showBusinessPicker" /> -->

        <VanField is-link>
          <template #label>
            <FormLabel label="所在地区" tips="选择所在地区，以便客户了解贵司位置和服务范围"/>
          </template>
          <template #input>
            <div class="flex1" >
              <VanField class="pd0" readonly placeholder="请选择业务所在地域" v-model="data.area" @click="areaClick"/>
            </div>
          </template>
        </VanField>
        <AreaSelect ref="areaSelectRef" v-model="data.area"/>

        <VanField
          v-model="data.desc"
          placeholder="请输入介绍"
          type="textarea"
          show-word-limit
          :maxlength="252"
          :clearable="true"
          :rows="3"
          :rules="[{validator: valiDesc}]"
        >
          <template #label>
            <FormLabel label="业务介绍" tips="填写业务介绍以便更好地展示贵司的服务和产品，帮助客户快速了解您的专业领域"/>
          </template>
        </VanField>
      </VanCellGroup>

      <VanCellGroup v-if="isEdit">
        <VanField v-model="data.address" placeholder="请输入详细地址" :maxlength="200">
          <template #label>
            <FormLabel label="详细地址" tips="填写详细地址，以便客户能够方便地上门联系您"/>
          </template>
        </VanField>

        <VanField v-model="data.phone" placeholder="请输入联系电话" :maxlength="20">
          <template #label>
            <FormLabel label="联系电话" tips="填写联系电话，以便客户与您顺利联系"/>
          </template>
        </VanField>

        <VanField >
          <template #label>
            <FormLabel label="微信二维码" tips="上传微信二维码，方便客户通过微信与您联系"/>
          </template>
          <template #input>
            <UploadImgs ref="uploadImgsRef2" v-model="data.qrcodeUrl" :maxCount="1"/>
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
import Select from '@/components/select/index.vue'

const {
  data,
  formRef,
  saveHandle,
  init,
  areaSelectRef,
  areaClick,
  businessOpts,
  showBusinessPicker,
  businessDisplay,
  isEdit,
  businessTips,
  businessClick,
  uploadImgsRef,
  uploadImgsRef2,
  loading,
  valiName,
  valiDesc
} = useAlbumMod()


init()


  
</script>

<style scoped lang="scss">
.view-album-mod {
  :deep(.van-cell-group) {
    margin-bottom: $mrL;
    .van-field__label {
      width: 84px;
    }
    .van-field--disabled {
      .flex1 {
        .van-field__control {
          color: #c8c9cc
        }
      }
    }
  }
  .bottom {
    margin: 16px;
  }

}
</style>


