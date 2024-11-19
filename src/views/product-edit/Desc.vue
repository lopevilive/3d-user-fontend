<template>
  <VanField
    v-model="valDisplay"
    :required="true"
    label="产品描述"
    placeholder="描述一下产品的信息～"
    readonly
    is-link
    @click="clickHandle"
    :rules="[{required: true, message: '产品描述不能为空'}]"
  />
  <VanDialog
    class="com-product-edit__desc"
    v-model:show="show"
    teleport="body"
    show-cancel-button
    :beforeClose="beforeCloseHandle"
  >
    <div class="content">
      <VanField
        ref="fieldRef"
        v-model="tmpVal"
        rows="1"
        autosize
        type="textarea"
        placeholder="请输入产品描述～"
      />
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant';

const props = defineProps({
  modelValue: {type: String}
})

const emits = defineEmits(['update:modelValue'])

const valDisplay = computed(() => {
  const {modelValue} = props
  return modelValue
})

const fieldRef = ref()
const show = ref(false)
const tmpVal = ref()

const clickHandle = () => {
  show.value = true
  tmpVal.value = props.modelValue
  setTimeout(() => {
    fieldRef.value.focus()
  }, 300);
}

const beforeCloseHandle = (action) => {
  if (action === 'cancel') return true
  let val = tmpVal.value || ''
  val = val.trim()
  if (!val) {
    showToast('描述不能为空～')
    return false
  }
  emits('update:modelValue', tmpVal.value)
  return true
}



</script>


<style lang="scss" scoped>
.com-product-edit__desc {
  .content {
    height: 50vh;
    overflow: auto;
    :deep(textarea) {
      min-height: 50vh;
    }
  }
}

</style>
