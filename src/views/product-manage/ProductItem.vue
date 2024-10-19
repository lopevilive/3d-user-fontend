<template>
  <div class="com-product-item" :class="{'shake': globalData.editStatus === 1}">
    <div class="content" @click="handleClick">
      <div class="img">
        <VanImage fit="contain" :src="urlDisplay" />
      </div>
      <div class="desc">{{ data.name }}</div>
      <div class="price" v-if="data.price">¥ {{ data.price }}</div>
    </div>
    <div class="setting" v-if="globalData.editStatus === 1" @click="settingClickHandle">
      <VanIcon name="setting-o" />
    </div>
    <VanActionSheet
      :actions="actions"
      v-model:show="isShow"
      cancel-text="取消"
      teleport="body"
      @select="selectHandle"
    />
  </div>
</template>

<script setup>
import {computed} from 'vue'
import { useRouter } from 'vue-router'
import { globalData } from '@/store'
import { useProductItem } from './hook'

const router = useRouter()

const props = defineProps({
  data: {type: Object, default: () => {}}
})

const emits = defineEmits(['update'])

const {actions, isShow, settingClickHandle, selectHandle} = useProductItem(props,emits)

const handleClick = () => {
  const {id} = props.data
  if (globalData.value.editStatus === 1) {
    router.push({name: 'product-edit', params: {id}})
  } else {
    router.push({name: 'product-detial', params: {id}})
  }
}

const urlDisplay = computed(() => {
  const {url} = props.data
  if (!url) return ''
  return url.split(',')[0]
})


</script>

<style lang="scss" scoped>
.com-product-item {
  width: 94%;
  flex-shrink: 0;
  background-color: $bgWhite;
  margin-bottom: $mrM;
  box-sizing: border-box;
  position: relative;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $pdM;
    box-sizing: border-box;
  }
  .img {
    overflow: hidden;
    // width: 140px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // margin: $mrL 0;
  }
  .desc {
    line-height: 20px;
    color: $grey;
    width: 100%;
    padding-top: $pdM;
    box-sizing: border-box;
  }
  .price {
    font-weight: bold;
    width: 100%;
    margin-top: $mrL;
    color: $grey;
  }
  .setting {
    position: absolute;
    top: -12px;
    left: -12px;
    font-size: 16px;
    z-index: 100;
    padding: 10px;
    :deep(.van-icon) {
      width: 28px;
      height: 28px;
      background: #929ca7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.shake {
  animation: shake 180ms infinite linear;
}
@keyframes shake {
  10%, 25% { transform: rotate(1deg); }
  25%, 50% { transform: rotate(0deg); }
  50%, 75% { transform: rotate(-1deg); }
  75%, 100% { transform: rotate(0deg); }
}

</style>