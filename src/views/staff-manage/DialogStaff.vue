<template>
  <VanDialog v-model:show="show" show-cancel-button :beforeClose="beforeClose" title="新增管理员">
    <VanForm ref="formRef">
      <VanField
        :required="true"
        placeholder="请输入管理员昵称"
        v-model="nickName" 
        :rules="[{validator: validNickName}]"
      >
        <template #label>
          <FormLabel label="昵称" tips="管理员昵称（仅您可见）：为了方便管理，请输入一个简洁易记的昵称"/>
        </template>
      </VanField>
    </VanForm>
  </VanDialog>
</template>

<script setup>
import { useDialogStaff } from './hook'
import FormLabel from '@/components/form-label/index.vue'

const props = defineProps({
  type: {type: Number, default: 1} // 1管理员、2分销员
})

const {
  show,
  beforeClose,
  open,
  nickName,
  validNickName,
  formRef
} = useDialogStaff(props)

defineExpose({open})



</script>