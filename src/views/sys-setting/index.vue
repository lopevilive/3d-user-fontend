<template>
  <div class="view-sys-setting">
    <VanCell title="编辑画册" is-link @click="toModAlbum" />
    <VanCell title="新增管理员" is-link @click="toModStaff" v-if="[3,99].includes(globalData.rid)" />
    <VanCell title="联系客服" is-link @click="toContactSys"/>
    <VanCell title="用户协议" is-link @click="toViewProtocol" />
    <div class="group-tit">隐私设置</div>
    <VanCell title="画册加密">
      <template #value>
        <div>
          <VanSwitch v-model="isEncry"/>
        </div>
      </template>
    </VanCell>
    <VanCell v-if="shopInfo.encry === 1 && encryCode"  title="画册密码" :label="encryCode">
      <template #value>
        <VanButton text="刷新密码" size="small" @click="refreshCode" />
        <VanButton class="btn-copy" text="复制密码" size="small" @click="copyStr(encryCode)" />
      </template>
    </VanCell>
  </div>
</template>

<script setup>
import { useSysSetting } from './hook'
import { copyStr } from '@/util'

const {
  toModAlbum,
  toModStaff,
  toViewProtocol,
  init,
  globalData,
  toContactSys,
  isEncry,
  encryCode,
  shopInfo,
  refreshCode
} = useSysSetting()

init()

</script>


<style lang="scss" scoped>
.view-sys-setting {
  margin-bottom: $footerBarH;
  .group-tit {
    padding: 0 $pdH;
    line-height: 30px;
  }
  .btn-copy {
    margin-left: 10px;
  }
}

</style>