<template>
  <div class="view-sys-setting">
    <van-cell-group inset title="账号">
      <VanCell title="编辑图册" is-link @click="toModAlbum" />
      <VanCell title="新增管理员" is-link @click="toModStaff" v-if="[3,99].includes(globalData.rid)" />
      <VanCell is-link @click="showVip" v-if="isShowVip">
        <template #title>
          <div class="vip-item">
            <div>会员权益</div>
            <VanIcon name="gem-o" />
          </div>
        </template>
        <template #label>
          <div class="vip-desc-wrap">
            <div class="left-wrap">
              <span>当前：</span>
              <span>{{ vipName }}</span>
            </div>
            <div class="right-wrap" v-if="isVip(shopInfo, false)">
              {{ expiredTimeDisplay }} 到期
            </div>
          </div>
        </template>
      </VanCell>
      <VanCell title="联系客服" is-link @click="toContactSys"/>
    </van-cell-group>
    
    <!-- 隐私设置 -->
    <van-cell-group inset title="隐私设置">
      <VanCell title="限制转发" class="cell-label-width-200" label="开启后，仅管理员可转发分享图册" v-if="isShowForward">
        <template #value>
          <VanSwitch v-model="isForwardPermi"/>
        </template>
      </VanCell>
      <VanCell title="图册加密" class="cell__switch">
        <template #value>
          <VanSwitch v-model="isEncry"/>
        </template>
      </VanCell>
      <VanCell v-if="shopInfo.encry === 1 && encryCode"  title="图册密码" :label="encryCode">
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
      <VanCell title="限制导出 Excel"  class="cell-label-width-200" label="开启后，仅管理员可导出清单 Excel">
        <template #value>
          <VanSwitch v-model="inveExportStatus"/>
        </template>
      </VanCell>
    </van-cell-group>

    <van-cell-group inset title="购物清单设置">
      <VanCell title="收货信息必填"  class="cell-label-width-200" label="开启后，客户需要填写收货信息才能提交清单">
        <template #value>
            <VanSwitch v-model="needAddress"/>
        </template>
      </VanCell>
      <VanCell
        title="必选分类" class="cell-label-width-200"
        label="客户必须选择指定分类下的产品方可提交清单（如：口味、是否需要餐具等。）"
        @click="handleRequiredType"
      >
        <template #value>
          <div>{{ displayRequiredType }}</div>
        </template>
      </VanCell>
    </van-cell-group>

    <van-cell-group inset title="图册设置">
      <VanCell title="首页轮播图"  class="cell-label-width-200" label="店铺置顶信息与活动，支持自动轮播切换">
        <template #value>
          <VanSwitch v-model="bannerStatus"/>
        </template>
      </VanCell>
      <VanCell title="轮播图配置" is-link @click="toBannerCfg" v-if="shopInfo.bannerStatus === 1" />
      <VanCell title="隐藏“全部”标签页"  class="cell-label-width-200" label="开启后，产品分类导航栏中的‘全部’标签页将被隐藏">
        <template #value>
          <VanSwitch v-model="typeStatus"/>
        </template>
      </VanCell>
      <VanCell title="分类栏位置"  class="cell-label-width-200" @click="handleTypeSideClick">
        <template #value>
          <div>{{ displayTypeSideMod }}</div>
        </template>
      </VanCell>
    </van-cell-group>


    <!-- 其他 -->
    <van-cell-group inset title="其他">
      <VanCell title="反馈建议" is-link @click="toFeedback"/>
      <VanCell title="用户协议" is-link @click="toViewProtocol"/>
    </van-cell-group>
    <TypeSelectDialog  ref="typeSelectDialogRef" />
  </div>
  <TypeSideSelect ref="typeSideSelectRef" />
</template>

<script setup>
import { useSysSetting } from './hook'
import { copyStr, isVip } from '@/util'
import TypeSelectDialog from '@/components/type-select-dialog/index.vue'
import TypeSideSelect from './TypeSideSelect.vue'

const {
  toModAlbum, toModStaff, toViewProtocol, init, globalData, toContactSys,
  isEncry, encryCode, shopInfo, refreshCode, toFeedback, isWaterMark, handleWaterMark,
  showVip, needAddress, inveExportStatus, toBannerCfg, bannerStatus, vipName, typeStatus,
  expiredTimeDisplay, isShowVip, displayRequiredType, handleRequiredType, typeSelectDialogRef,
  isForwardPermi, isShowForward, displayTypeSideMod, typeSideSelectRef, handleTypeSideClick
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
  .vip-desc-wrap {
    display: flex;
    justify-content: space-between;
  }
}

</style>