<template>
  <VanDialog
    v-model:show="isShow" show-cancel-button cancelButtonText="关闭"
    confirmButtonText="前往续费" title="到期提示"
    :beforeClose="beforeClose"
  >
    <div class="common-label-tips text-center">{{ displayTips }}</div>
  </VanDialog>
</template>

<script setup>
import { useExpiredTipsHook } from './expiredTipsHook'

const {
  isShow, beforeClose, displayTips
} = useExpiredTipsHook()

</script>

