<template>
  <div class="com-cell-label">
    <div class="text-wrap">
      <slot>
        {{ txt }}
      </slot>
    </div>
    <div v-if="url.length" class="btn-view-demo" @click="viewHandle">查看示例</div>
  </div>
</template>

<script setup>
import { showImagePreview, showToast } from 'vant';
import { globalData } from '@/store'

const props = defineProps({
  txt: {type: String, default: ''},
  url: {type: Array, default: () => []}
})

const viewHandle = async () => {
  if (globalData.value.isPC) {
    showToast('请用手机查看')
    return
  }
  showImagePreview(props.url)
}

</script>

<style lang="scss" scoped>
.com-cell-label {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  flex-wrap: wrap;
  .btn-view-demo {
    color: $btnText;
    padding: 0  10px;
    flex-shrink: 0;
  }
}

</style>