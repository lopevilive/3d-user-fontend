<template>
  <div class="view-staff-verify">
    <VanDialog
      v-model:show="show"
      cancel-button-text="拒绝"
      cancel-button-color="red"
      show-cancel-button
      confirm-button-text="接受"
      :before-close="beforeCloseHandle"
    >
      <template #title>
        <div class="tit">
          <VanImage :src="getImageUrl(urlDisplay)" round/>
          <div>成为管理员</div>
        </div>
      </template>
      <div class="content">
        <span class="name">【{{shopInfo.name}}】</span>邀请您成为管理员～
      </div>
    </VanDialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStaffVerify } from './hook'
import { getImageUrl } from '@/util'

const {
  init,
  show,
  shopInfo,
  urlDisplay,
  beforeCloseHandle
} = useStaffVerify()

onMounted(init)

</script>

<style scoped lang="scss">
.view-staff-verify {
  .tit {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.van-image) {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
  }
  .content {
    padding: $pdH 0;
    .name {
      font-weight: bold;
    }
  }
}

</style>