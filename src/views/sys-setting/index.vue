<template>
  <div class="view-sys-setting">
    <van-cell-group inset title="账号">
      <VanCell
        title="图册信息管理" is-link @click="toModAlbum" class="cell-label-width-200"
        label="图册名称/封面/联系方式等"
      >
      </VanCell>
      <VanCell
        title="人员管理" is-link @click="toModStaff" v-if="[3,99].includes(globalData.rid)"
        class="cell-label-width-200"
        label="配置管理员"
      />
      <!-- label="配置管理员或关联合作伙伴/经销商" -->
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
    
    <van-cell-group inset title="图册设置">
      <VanCell title="首页装修" class="cell-label-width-200">
        <template #label>
          <CellLabel txt="自定义首页装饰" :url="[E_img_url_map.homePageDemo]" />
        </template>
        <template #value>
          <div @click="toHomeMod">
            <VanIcon name="arrow" />
          </div>
        </template>
      </VanCell>
      <VanCell title="产品页轮播图展示"  class="cell-label-width-200">
        <template #label>
          <CellLabel txt="展示店铺置顶信息，支持自动轮播" :url="[E_img_url_map.bannerDemo]" />
        </template>
        <template #value>
          <VanSwitch v-model="bannerStatus"/>
        </template>
      </VanCell>
      <VanCell title="轮播图配置" is-link @click="toBannerCfg" v-if="shopInfo.bannerStatus === 1" />
      <VanCell title="分类栏展示位置"  class="cell-label-width-200" @click="handleTypeSideClick">
        <template #value>
          <div>{{ displayTypeSideMod }}</div>
        </template>
      </VanCell>
      <VanCell title="隐藏 “全部” 分类标签"  class="cell-label-width-200">
        <template #label>
          <CellLabel txt="隐藏导航栏的 “全部” 分类标签" :url="[E_img_url_map.hideAllTypeDemo]" />
        </template>
        <template #value>
          <VanSwitch v-model="typeStatus"/>
        </template>
      </VanCell>
    </van-cell-group>
    
    <!-- 隐私设置 -->
    <van-cell-group inset title="隐私设置">
      <VanCell class="cell__switch cell-label-width-200">
        <template #title>
          <div class="vip-item">
            <div>图片水印自动添加</div>
            <VanIcon name="gem-o" />
          </div>
        </template>
        <template #label>
          <CellLabel txt="新上传图片自动添加水印"
            :url="[E_img_url_map.waterImgDemo1,E_img_url_map.waterImgDemo2]"
          />
        </template>
        <template #value>
          <VanSwitch v-model="isWaterMark"/>
        </template>
      </VanCell>
      <VanCell title="水印样式管理" is-link v-if="isWaterMark" @click="handleWaterMark"></VanCell>
      <VanCell class="cell-label-width-200" label="开启后，仅管理员可分享图册" v-if="isShowForward">
        <template #title>
          <div class="vip-item">
            <div>分享权限控制</div>
            <VanIcon name="gem-o" />
          </div>
        </template>
        <template #value>
          <VanSwitch v-model="isForwardPermi"/>
        </template>
      </VanCell>
      <VanCell title="图册访问密码保护" class="cell__switch">
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
      <VanCell title="Excel 清单导出权限"  class="cell-label-width-200" label="仅管理员可导出 Excel 清单">
        <template #value>
          <VanSwitch v-model="inveExportStatus"/>
        </template>
      </VanCell>
    </van-cell-group>

    <van-cell-group inset title="购物清单设置">
      <VanCell title="收货信息必填"  class="cell-label-width-200" label="提交清单需填写收货信息">
        <template #value>
            <VanSwitch v-model="needAddress"/>
        </template>
      </VanCell>
      <VanCell
        title="提交清单必选分类" class="cell-label-width-200"
        label="提交清单需选择指定分类产品（如：口味、是否需要餐具等。）"
        @click="handleRequiredType"
      >
        <template #value>
          <div>{{ displayRequiredType }}</div>
        </template>
      </VanCell>
    </van-cell-group>


    <!-- 其他 -->
    <van-cell-group inset title="其他">
      <VanCell title="意见反馈" is-link @click="toFeedback"/>
      <VanCell title="用户服务协议" is-link @click="toViewProtocol"/>
    </van-cell-group>
    <TypeSelectDialog  ref="typeSelectDialogRef" />
  </div>
  <TypeSideSelect ref="typeSideSelectRef" />
</template>

<script setup>
import { useSysSetting } from './hook'
import { copyStr, isVip, E_img_url_map } from '@/util'
import TypeSelectDialog from '@/components/type-select-dialog/index.vue'
import TypeSideSelect from './TypeSideSelect.vue'
import CellLabel from '@/components/cell-label/index.vue'

const {
  toModAlbum, toModStaff, toViewProtocol, init, globalData, toContactSys,
  isEncry, encryCode, shopInfo, refreshCode, toFeedback, isWaterMark, handleWaterMark,
  showVip, needAddress, inveExportStatus, toBannerCfg, bannerStatus, vipName, typeStatus,
  expiredTimeDisplay, isShowVip, displayRequiredType, handleRequiredType, typeSelectDialogRef,
  isForwardPermi, isShowForward, displayTypeSideMod, typeSideSelectRef, handleTypeSideClick,
  toHomeMod
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