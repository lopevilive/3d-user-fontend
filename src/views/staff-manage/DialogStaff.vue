<template>
  <VanDialog v-model:show="show" show-cancel-button :beforeClose="beforeClose" :title="`新增${type === 1 ? '管理' : '分销'}员 `">
    <VanForm ref="formRef">
      <VanField
        :required="true"
        :placeholder="`请输入${type === 1 ? '管理' : '分销'}员昵称`"
        v-model="nickName" 
        :rules="[{validator: validNickName}]"
      >
        <template #label>
          <FormLabel label="昵称" :tips="`${type === 1 ? '管理' : '分销'}员备注名（仅您可见），方便您快速识别对方身份`"/>
        </template>
      </VanField>
    </VanForm>
  </VanDialog>
</template>

<script setup>
import { useDialogStaff } from './useDialogStaff'
import FormLabel from '@/components/form-label/index.vue'

const props = defineProps({
  type: {type: Number, default: 1} // 1管理员、2分销员
})

const emits = defineEmits(['update'])

const {
  show,
  beforeClose,
  open,
  nickName,
  validNickName,
  formRef
} = useDialogStaff(props, emits)

defineExpose({open})



</script>