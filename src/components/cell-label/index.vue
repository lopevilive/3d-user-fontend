<template>
  <div class="com-cell-label">
    <div class="text-wrap">
      <slot>
        {{ txt }}
      </slot>
    </div>
    <div v-if="url.length" class="btn-view-demo" @click="viewHandle">查看示例</div>
  </div>
  <DialogImgs ref="dialogImgs" />
</template>

<script setup>
import { ref } from 'vue'
import ImgSwipeV2 from '@/components/img-swipe-v2/index.vue'
import DialogImgs from '@/components/dialog-imgs/index.vue'

const props = defineProps({
  txt: {type: String, default: ''},
  url: {type: Array, default: () => []}
})

const dialogImgs = ref()
const viewHandle = async () => {
  dialogImgs.value.show(props.url)
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