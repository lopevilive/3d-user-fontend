<template>
  <div class="view-staff-verify">
    <VanDialog
      v-model:show="show"
      cancel-button-text="拒绝"
      cancel-button-color="#ee0a24"
      show-cancel-button
      confirm-button-text="接受邀请"
      confirm-button-color="#07c160"
      :before-close="beforeCloseHandle"
    >
      <template #title>
        <div class="invite-header">
          <VanImage :src="getImageUrl(urlDisplay)" round class="shop-logo" />
          <div class="shop-name">{{ shopInfo.name }}</div>
          <div class="role-badge">
            <VanTag :type="staffInfo.type === 1 ? 'primary' : 'success'" size="medium" plain pill>
              {{ staffInfo.type === 1 ? '管理员' : '分销员' }}邀请
            </VanTag>
          </div>
        </div>
      </template>

      <!-- <div class="invite-content">
        <div class="invite-msg">
          诚邀您加入我们的经营体系，成为我们的合作伙伴。
        </div>
        
        <div class="privilege-card">
          <div class="card-title">加入后您可以：</div>
          <div class="privilege-list">
            <template v-if="staffInfo.type === 1">
              <div class="p-item"><van-icon name="edit" /> 管理产品及分类</div>
              <div class="p-item"><van-icon name="chart-trending-o" /> 查看经营统计报表</div>
              <div class="p-item"><van-icon name="friends-o" /> 协助管理分销渠道</div>
            </template>
            <template v-else>
              <div class="p-item"><van-icon name="eye-o" /> 查看产品内部批发价</div>
              <div class="p-item"><van-icon name="share-o" /> 突破限制转发产品图册</div>
              <div class="p-item"><van-icon name="phone-circle-o" /> 直接联系批发商拿货</div>
            </template>
          </div>
        </div>
      </div> -->
    </VanDialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStaffVerify } from './hook'
import { getImageUrl } from '@/util'

const {
  init,
  show,
  shopInfo,
  urlDisplay,
  beforeCloseHandle,
  staffInfo
} = useStaffVerify()

onMounted(init)
</script>

<style scoped lang="scss">
.view-staff-verify {

  .invite-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 24px;

    .shop-logo {
      width: 64px;
      height: 64px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border: 2px solid #fff;
    }

    .shop-name {
      font-size: 18px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 8px;
      padding: 0 20px;
      text-align: center;
    }
  }

  .invite-content {
    padding: 16px 24px 24px;

    .invite-msg {
      font-size: 14px;
      color: #646566;
      text-align: center;
      line-height: 1.5;
      margin-bottom: 20px;
    }

    .privilege-card {
      background: #f7f8fa;
      border-radius: 10px;
      padding: 16px;

      .card-title {
        font-size: 12px;
        color: #969799;
        margin-bottom: 10px;
        font-weight: 500;
      }

      .privilege-list {
        .p-item {
          font-size: 14px;
          color: #323233;
          margin: 8px 0;
          display: flex;
          align-items: center;
          
          .van-icon {
            color: #07c160;
            margin-right: 8px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>