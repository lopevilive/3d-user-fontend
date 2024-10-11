<template>
  <div class="com-setting">
     <VanFloatingBubble
      class="setting-floating"
      axis="xy"
      magnetic="x"
      :gap="0"
      v-model:offset="offset"
      @click="show = true"
      v-if="isShow"
    >
      <div class="content">
        <VanIcon name="setting-o"/>
      </div>
    </VanFloatingBubble>
    <VanActionSheet
      :actions="actionDisplay"
      v-model:show="show"
      @select="selectHandle"
      close-on-click-action
      cancel-text="取消"
    />
    <div class="done" v-if="isShowDone" @click="handleDone">完成</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSetting } from './hook'

const { actionDisplay, isShow, isShowDone, handleDone } = useSetting()

const offset = ref({ x: document.body.clientWidth * 0.872, y: document.body.clientHeight * 0.7});


const show = ref(false)

const selectHandle = (item) => {
  item?.action()
}


</script>

<style lang="scss" scoped>
.com-setting {
  .done{
    position: fixed;
    right: 10px;
    top: 10px;
    background: #7e7e80;
    border-radius: 40px;
    padding: 5px 20px;
    font-weight: bold;
    font-size: 12px;
  }
}

</style>

