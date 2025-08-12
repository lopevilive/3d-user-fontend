<template>
  <div class="com-add-controls" v-if="isShow">
    <template v-if="mode === 0">
      <div class="single" v-if="productInfo.isSpec === 0">
        <CountControls v-model:count="carInfo.count.value" />
      </div>
      <div v-if="[1,2].includes(productInfo.isSpec)" class="select-spec" @click="specClickHandle">选规格</div>
    </template>

    <template v-if="mode === 1">
      <!-- 单规格 -->
      <template v-if="productInfo.isSpec === 0">
        <VanButton
          v-if="carInfo.count.value === 0"
          size="small" text="+加入清单" color="#f6d961" round
          @click="carInfo.count.value = 1"
        />
        <CountControls v-if="carInfo.count.value > 0" v-model:count="carInfo.count.value" />
      </template>
       
      <!-- 多规格 -->
      <VanButton
        v-if="[1,2].includes(productInfo.isSpec)"
        size="small" text="+加入清单" color="#f6d961" round
        name="add-controls-spec"
        @click="specClickHandle"
      />
    </template>
    <SpecAdd v-if="[1,2].includes(productInfo.isSpec)" ref="specAddRef" :productInfo="productInfo" />
  </div>
</template>

<script setup>
import { useAddControls } from './hook'
import CountControls from './CountControls.vue'
import SpecAdd from './SpecAdd.vue'

const props = defineProps({
  productInfo: {type: Object, default: () => {}},
  mode: {type: Number, default: 0}
})

const {
  isShow, carInfo, specAddRef, specClickHandle
} = useAddControls(props)

</script>

<style lang="scss" scoped>
.com-add-controls {
  .select-spec {
    background: #f6d961;
    font-size: 12px;
    height: 20px;
    padding: 0 10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
}
.spec-item {
  display: flex;
  justify-content: space-between;
  // margin: 14px 0;
  padding: 10px 24px;
  &:first-child {
    padding-top: 24px;
  }
  &:last-child {
    padding-bottom: 24px;
  }
  .left-content {
    .price {
      color: $red;
    }
  }
}
</style>


