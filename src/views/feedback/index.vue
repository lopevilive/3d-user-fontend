<template>
  <div class="view-feedback">
    <VanCell>
      <template #title>
        <span>问题和意见</span>
        <span style="color: red;">*</span>
      </template>
    </VanCell>
    <VanField
      v-model="feedbackStr"
      placeholder="请填写你的功能建议，感谢你的支持～ (必填)"
      type="textarea"
      :maxlength="200"
      :rows="4"
      :clearable="true"
      :show-word-limit="true"
    />
    <VanCell class="feedback-item__tit" title="图片 (选填，提供问题截图)" />
    <div class="img-wrap">
      <UploadImgs
        v-model="url"
        :maxCount="10"
        ref="uploadImgsRef"
      />
    </div>
    <VanCell class="feedback-item__tit" title="联系方式" />
    <VanField placeholder="留下联系方式，更可能解决问题～" v-model="contactStr" :maxlength="50"/>
    <div class="bottom-btn">
      <VanButton block type="primary" native-type="submit" @click="submit" >提交</VanButton>
    </div>
  </div>
</template>

<script setup>
import UploadImgs from '@/components/uploadImgs/index.vue'
import { useFeedback } from './hook'

const {
  submit,
  feedbackStr,
  uploadImgsRef,
  url,
  contactStr
} = useFeedback()



</script>

<style lang="scss" scoped>
.view-feedback {
  padding-bottom: $footerBarH;
  .feedback-item__tit {
    margin-top: $pdH;
  }
  .img-wrap {
    background: $bgWhite;
    padding: 0 $pdM;
    padding-top: $pdL;
  }
  .bottom-btn {
    height: $footerBarH;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    background: $bgWhite;
    display: flex;
    padding: 0 $pdH;
    padding-top: 8px;
  }
}

</style>
