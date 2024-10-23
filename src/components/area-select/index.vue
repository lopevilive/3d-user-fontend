<template>
  <van-popup v-model:show="isShow" round position="bottom">
    <van-cascader
      title="请选择所在地区"
      :options="options"
      @close="isShow = false"
      @finish="onFinish"
    />
  </van-popup>
</template>

<script setup>
import { ref } from 'vue'
import { useCascaderAreaData } from '@vant/area-data';

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {type: String, default: ''}
})

const options = useCascaderAreaData();

const isShow = ref(false)

const onFinish = ({ selectedOptions }) => {
  isShow.value = false;
  const res = selectedOptions.map((option) => option.text).join('/');
  emits('update:modelValue', res)
};


const show = () => {
  isShow.value = true
}

defineExpose({show})

</script>