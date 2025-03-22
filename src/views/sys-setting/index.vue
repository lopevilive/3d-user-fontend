<template>
  <div class="view-sys-setting">
    <van-cell-group inset title="账号">
      <VanCell title="编辑画册" is-link @click="toModAlbum" />
      <VanCell title="新增管理员" is-link @click="toModStaff" v-if="[3,99].includes(globalData.rid)" />
      <VanCell is-link @click="showVip">
        <template #title>
          <div class="vip-item">
            <div>会员权益</div>
            <VanIcon name="gem-o" />
          </div>
        </template>
      </VanCell>
    </van-cell-group>
    
    <!-- 隐私设置 -->
    <van-cell-group inset title="隐私设置">
      <VanCell title="画册加密" class="cell__switch">
        <template #value>
            <VanSwitch v-model="isEncry"/>
        </template>
      </VanCell>
      <VanCell v-if="shopInfo.encry === 1 && encryCode"  title="画册密码" :label="encryCode">
        <template #value>
          <VanButton text="刷新密码" size="small" @click="refreshCode" />
          <VanButton class="btn-copy" text="复制密码" size="small" @click="copyStr(encryCode)" />
        </template>
      </VanCell>
      <VanCell title="图片水印" class="cell__switch">
        <template #value>
            <VanSwitch v-model="isWaterMark"/>
        </template>
      </VanCell>
      <VanCell title="水印设置" is-link v-if="isWaterMark" @click="handleWaterMark"></VanCell>
    </van-cell-group>

    <van-cell-group inset title="清单设置">
      <VanCell title="收货信息必填"  class="cell-label-width-200" label="开启后，客户需要填写收货信息才能提交清单">
        <template #value>
            <VanSwitch v-model="needAddress"/>
        </template>
      </VanCell>
      <!-- <VanCell title="禁止用户导出清单"  class="cell-label-width-200" label="开启后，客户无法导出清单 Excel">
        <template #value>
            <VanSwitch v-model="isWaterMark"/>
        </template>
      </VanCell> -->
    </van-cell-group>


    <!-- 其他 -->
    <van-cell-group inset title="其他">
      <VanCell title="联系客服" is-link @click="toContactSys"/>
      <VanCell title="反馈建议" is-link @click="toFeedback"/>
      <VanCell title="用户协议" is-link @click="toViewProtocol"/>
    </van-cell-group>
  </div>
  <DialogVip ref="dialogVipRef" />
</template>

<script setup>
import { useSysSetting } from './hook'
import { copyStr } from '@/util'
import DialogVip from '@/components/dialog-vip/index.vue'

const {
  toModAlbum, toModStaff, toViewProtocol, init, globalData, toContactSys,
  isEncry, encryCode, shopInfo, refreshCode, toFeedback, isWaterMark, handleWaterMark,
  showVip, dialogVipRef, needAddress
} = useSysSetting()

init()

</script>


<style lang="scss" scoped>
.view-sys-setting {
  padding-bottom: $footerBarH;
  .btn-copy {
    margin-left: 10px;
  }
  .cell__switch {
    :deep(.van-cell__value) {
      display: flex;
      flex-direction: row-reverse;
    }
  }
  .vip-item {
    display: flex;
    align-items: center;
    .van-icon {
      color: #FFD700;
    }
  }
}

</style>