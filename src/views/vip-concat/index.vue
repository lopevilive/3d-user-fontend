<template>
  <div class="view-vip-concat" v-if="vipInfo">
    <VanSticky>
      <div class="upgrade-notice">
        <VanIcon name="bullhorn-o" class="notice-icon" />
        <span class="notice-text">在线支付系统升级中（预计4月完成），开通升级/续费请联系客服~</span>
      </div>
    </VanSticky>

    <div class="user-status-section">
      <div class="status-card">
        <div class="card-left">
          <div class="level-row">
            <span class="label">当前等级</span>
            <span class="value">{{ getLevelName(vipInfo.level) }}</span>
            <div class="status-dot" :class="{ 'is-active': !isExpired }"></div>
          </div>
          <div class="info-row">
            包含额度：<span class="highlight">{{ currentLimit }}</span> 款产品
          </div>
          <div class="info-row time">
            {{ isExpired ? '已于' : '到期时间：' }}{{ formatTime(vipInfo.expiredTime) }}{{ isExpired ? '到期' : '' }}
          </div>
          <div v-if="isShowRemain">{{ vipInfo.amount }}</div>
        </div>
        <div class="card-pattern"></div>
        <VanIcon name="vip-card-o" class="bg-icon" />
      </div>
    </div>

    <div class="vip-container">
      <div 
        v-for="item in vipInfo.cfg" 
        :key="item.level"
        class="vip-card" 
        :class="[`level-border-${item.level}`, { 'is-current': item.level === vipInfo.level }]"
      >
        <div class="current-badge" v-if="item.level === vipInfo.level">当前等级</div>

        <div class="card-header">
          <div class="level-info">
            <span class="name">{{ getLevelName(item.level) }}</span>
            <span class="lvl-tag">LV.{{ item.level }}</span>
          </div>
          <div class="price">
            <template v-if="item.price > 0">
              <span class="symbol">¥</span>
              <span class="num">{{ (item.price / 100).toFixed(0) }}</span>
              <span class="unit">/年</span>
            </template>
            <span v-else class="free-text">永久免费</span>
          </div>
        </div>

        <div class="benefits-flex-wrap">
          <div class="benefit-item">
            <div class="icon-box blue"><VanIcon name="cluster-o" /></div>
            <div class="title">产品容量</div>
            <div class="desc">可上传<span class="num">{{ item.limit }}</span>个产品</div>
          </div>

          <div class="benefit-item">
            <div class="icon-box gray"><VanIcon name="photo-o" /></div>
            <div class="title">图片数量</div>
            <div class="desc">每款可传<span class="num">{{ item.imgC }}</span>张</div>
          </div>

          <div class="benefit-item">
            <div class="icon-box gray"><VanIcon name="description-o" /></div>
            <div class="title">详情图</div>
            <div class="desc">每款可传<span class="num">{{ item.descImgC }}</span>张</div>
          </div>

          <div class="benefit-item" :class="{ 'is-disabled': item.level === 0 }">
            <div class="icon-box cyan"><VanIcon name="photo-o" /></div>
            <div class="title">图片水印</div>
            <div class="desc">支持自动添加水印</div>
          </div>

          <div class="benefit-item" :class="{ 'is-disabled': item.level === 0 }">
            <div class="icon-box green"><VanIcon name="shield-o" /></div>
            <div class="title">转发保护</div>
            <div class="desc">仅管理员可转发</div>
          </div>


        </div>

        <VanIcon name="medal-o" class="bg-watermark" />
      </div>
    </div>

    <div class="footer-action">
      <div class="concat-info">
        <div class="title">咨询开通会员</div>
        <div class="sub">支付系统预计4月完成升级</div>
      </div>
      <VanButton 
        type="primary" 
        round 
        class="action-btn"
        @click="onContactAdmin"
      >
        联系客服
      </VanButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { showToast } from 'vant';
import { vipInfoManage, E_img_url_map } from '@/util';
import { globalData } from '@/store'

const route = useRoute();
const shopId = +route.params.shopId;
const vipInfo = ref(null);

const currentLimit = computed(() => {
  if (!vipInfo.value || !vipInfo.value.cfg) return 0;
  const current = vipInfo.value.cfg.find(c => c.level === vipInfo.value.level);
  return current ? current.limit : 0;
});

const isExpired = computed(() => {
  if (!vipInfo.value?.expiredTime) return false;
  return (vipInfo.value.expiredTime * 1000) < Date.now();
});

const getLevelName = (l) => {
  const names = ['基础版', '300容量会员', '600容量会员', '1000容量会员', '1500容量会员', '2000容量会员'];
  return names[l] || '高级会员';
};

const formatTime = (time) => {
  if (!time) return '永久有效';
  const date = new Date(time * 1000);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const onContactAdmin = () => {
  const payload = {
    qrcodeUrl: E_img_url_map.adminConcat,
    message: `长按识别二维码～`
  }
  let payloadStr = encodeURIComponent(JSON.stringify(payload))
  wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
};

const isShowRemain = computed(() => {
  const {rid} = globalData.value
  if ([99].includes(rid)) return true
  return false
})

const init = async () => {
  try {
    const ret = await vipInfoManage.getData(shopId); 
    if (ret && ret.length > 0) {
      vipInfo.value = ret[0];
    }
  } catch (error) {
    showToast('获取会员信息失败');
    console.error('VIP Init Error:', error);
  } finally {
  }
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
.view-vip-concat {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: calc(110px + env(safe-area-inset-bottom));

  .upgrade-notice {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 12px 16px; background: #fffbe6; 
    border-bottom: 1px solid #ffe58f; color: #d48806;
    font-size: 13px; font-weight: 500;
    .notice-icon { animation: bell-swing 2s infinite; }
  }

  .user-status-section {
    padding: 16px;
    .status-card {
      position: relative; border-radius: 12px; padding: 24px 20px;
      background: linear-gradient(135deg, #444c5a 0%, #2c313a 100%);
      color: #fff; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      .card-left {
        position: relative; z-index: 2;
        .level-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
          .value { font-size: 22px; font-weight: bold; color: #f1c40f; }
          .status-dot {
            width: 8px; height: 8px; border-radius: 50%; background: #95a5a6;
            &.is-active { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
          }
        }
        .info-row {
          font-size: 14px; margin-bottom: 6px;
          .highlight { color: #f1c40f; font-weight: bold; font-size: 16px; margin: 0 4px; }
          &.time { font-size: 12px; opacity: 0.5; }
        }
      }
      .bg-icon { position: absolute; right: 10px; bottom: -10px; font-size: 80px; color: rgba(255,255,255,0.05); }
    }
  }

  .vip-container {
    padding: 0 16px;
    .vip-card {
      position: relative; background: #fff; border-radius: 16px;
      padding: 24px 12px; margin-bottom: 16px; border: 1px solid #f0f0f0;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04); overflow: hidden;
      &.is-current { border: 2px solid #1989fa; }
      .current-badge {
        position: absolute; top: 0; right: 0; background: #1989fa; color: #fff;
        font-size: 11px; padding: 4px 12px; border-bottom-left-radius: 12px; font-weight: bold;
      }
      
      &[class*="level-border-"] { border-left-width: 5px; }
      .level-border-0 { border-left-color: #909399; }
      .level-border-1 { border-left-color: #67c23a; }
      .level-border-2 { border-left-color: #409eff; }
      .level-border-3 { border-left-color: #e6a23c; }
      .level-border-4 { border-left-color: #f56c6c; }
      .level-border-5 { border-left-color: #722ed1; }

      .card-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 4px;
        .name { font-size: 18px; font-weight: bold; color: #323233; }
        .lvl-tag { font-size: 10px; background: #f0f2f5; padding: 2px 6px; border-radius: 4px; color: #969799; }
        .price .num { font-size: 24px; font-weight: bold; color: #1989fa; }
        .free-text { color: #67c23a; font-weight: bold; font-size: 15px; }
      }

      // 权益网格布局的核心容器
      .benefits-flex-wrap {
        display: flex;
        flex-wrap: wrap;

        .benefit-item {
          width: 33.33%; // 一行三列
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          text-align: center;
          padding: 0 4px;
          box-sizing: border-box;

          &.is-disabled { opacity: 0.4; filter: grayscale(1); }

          .icon-box {
            width: 48px; height: 48px; border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 8px;
            .van-icon { font-size: 28px; }

            &.blue { background: #e8f2ff; .van-icon { color: #1989fa; } }
            &.cyan { background: #e6f7ff; .van-icon { color: #1890ff; } }
            &.green { background: #f6ffed; .van-icon { color: #52c41a; } }
            &.gray { background: #f5f5f5; .van-icon { color: #5c6b77; } }
          }

          .title { font-size: 14px; font-weight: bold; color: #323233; margin-bottom: 4px; line-height: 1.2; }
          .desc { 
            font-size: 11px; color: #969799; line-height: 1.3; 
            .num { color: #1989fa; font-weight: bold; }
          }
        }
      }
      .bg-watermark { position: absolute; right: -10px; bottom: -10px; font-size: 80px; color: rgba(0,0,0,0.02); transform: rotate(-15deg); }
    }
  }

  .footer-action {
    position: fixed; bottom: 0; left: 0; right: 0; background: #fff;
    padding: 12px 20px calc(15px + env(safe-area-inset-bottom));
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.05); z-index: 10;
    .concat-info {
      .title { font-size: 15px; font-weight: bold; color: #323233; }
      .sub { font-size: 11px; color: #969799; margin-top: 3px; }
    }
    .action-btn { width: 140px; height: 42px; font-weight: bold; font-size: 15px; }
  }
}

@keyframes bell-swing {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(15deg); }
  40% { transform: rotate(-15deg); }
  60% { transform: rotate(0); }
}
</style>