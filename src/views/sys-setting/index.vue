<template>
  <div class="view-sys-setting">
    <VanCell title="编辑图册" is-link @click="toModAlbum" />
    <VanCell title="新增管理员" is-link @click="toModStaff" v-if="[3,99].includes(globalData.rid)" />
    <VanCell title="联系客服" is-link @click="toContactSys"/>
    <VanCell title="用户协议" is-link @click="toViewProtocol" />
  </div>
</template>

<script setup>
import { useSysSetting } from './hook'

const {
  toModAlbum,
  toModStaff,
  toViewProtocol,
  init,
  globalData,
  toContactSys
} = useSysSetting()

init()

</script>


<style lang="scss" scoped>
.view-sys-setting {
  margin-bottom: $footerBarH;
}

</style>