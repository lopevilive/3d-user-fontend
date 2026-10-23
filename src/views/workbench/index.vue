<template>
  <div class="view-workbench">
    <!-- 顶部概览：深色会员卡 -->
    <div class="overview mrM">
      <div class="ov-light ov-light-1"></div>
      <div class="ov-light ov-light-2"></div>
      <!-- 会员徽标底纹 -->
      <VanIcon name="vip-card-o" class="ov-badge" />

      <!-- 图册封面 + 名称 / 会员等级 + 设置入口 -->
      <div class="ov-album">
        <VanImage class="album-cover" fit="cover" :src="coverUrl" />

        <div class="album-info">
          <div class="album-name">{{ shopName }}</div>
          <div class="level-line">
            <span class="level-chip" :class="{ 'is-plain': !isVipActive }">
              <VanIcon name="gem-o" class="level-icon" />
              <span class="level-name">{{ levelName }}</span>
              <span class="status-dot" :class="{ 'is-expired': !isVipActive }"></span>
            </span>
            <span class="expire-tag" v-if="expireText">{{ expireText }}</span>
          </div>
        </div>

        <div class="album-setting" @click="goSetting">
          <VanIcon name="setting-o" />
        </div>
      </div>

      <!-- 容量行：产品容量 173/600 + 升级 -->
      <div class="ov-capacity">
        <div class="cap-left">
          <span class="cap-label">产品容量</span>
          <span class="cap-value">
            <span class="num" :class="{ 'is-over': isOverLimit }">{{ usedCount }}</span>
            <span class="sep">/</span>
            <span class="total">{{ limitText }}</span>
          </span>
        </div>

        <div v-if="showUpgradeBtn" class="ov-btn" :class="upgradeClass" @click="gotoVip">
          {{ upgradeText }}
        </div>
      </div>

      <!-- 容量进度条：金色渐变，临界状态更有张力 -->
      <div class="ov-progress" v-if="showProgress">
        <div
          class="ov-progress-inner"
          :class="{ 'is-over': isOverLimit }"
          :style="{ width: `${percent}%` }"
        ></div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="action-area">
      <div class="primary-actions">
        <VanButton
          class="action-btn primary add-prod"
          icon="plus"
          color="linear-gradient(135deg, #6b9bff 0%, #2f5fe0 100%)"
          @click="toAddProd"
        >新增产品</VanButton>
        <VanButton
          class="action-btn primary share-album"
          icon="share-o"
          color="linear-gradient(135deg, #4ade9f 0%, #06b663 100%)"
          @click="toShare"
        >分享图册</VanButton>
      </div>

      <div class="sub-actions">
        <VanButton
          v-for="item in visibleSubActions"
          :key="item.key"
          class="action-btn sub"
          @click="btnClickHandle(item)"
        >
          <VanIcon :name="item.icon" class="sub-icon" />
          <span class="sub-title">{{ item.label }}</span>
        </VanButton>
      </div>

      <!-- 折叠 / 展开 -->
      <div v-if="showSubToggle" class="action-toggle" @click="subExpanded = !subExpanded">
        <span class="toggle-text">{{ subExpanded ? '收起' : '展开更多' }}</span>
        <VanIcon :name="subExpanded ? 'arrow-up' : 'arrow-down'" class="toggle-icon" />
      </div>
    </div>

    <!-- 图表区域：会员看数据，非会员看开通引导 -->
    <div v-if="vipLoaded" class="chart-content">
      <div v-if="isVipActive" class="main-analysis">
        <OperaAnalysis />
      </div>

      <div v-else class="novip-opera-analysis">
        <!-- 数据预览（模糊 + 上锁） -->
        <div class="lock-preview">
          <div class="lock-bars">
            <span v-for="(h, i) in fakeBars" :key="i" :style="{ height: `${h}%` }"></span>
          </div>
          <div class="lock-mask">
            <VanIcon name="lock" class="lock-icon" />
            <span class="lock-text">开通会员，查看每日访问人数</span>

            <VanButton
              class="learn-btn"
              icon="arrow"
              icon-position="right"
              @click="gotoVip"
            >前往了解</VanButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { globalData } from '@/store'
import { vipInfoManage, shopInfoManage, getImageUrl, E_vip_map, toShareAlbum, toVip } from '@/util'

const OperaAnalysis = defineAsyncComponent({
  loader: () => import('@/views/workbench/OperaAnalysis.vue')
})

const route = useRoute()
const router = useRouter()
const shopId = +route.params.shopId

const vipInfo = ref(null)
const shopInfo = ref({})
const vipLoaded = ref(false) // 会员信息是否已加载（避免引导区闪现）

// 图册封面（url 为逗号分隔的图片地址，取第一张）
const coverUrl = computed(() => {
  const url = shopInfo.value?.url?.split(',')[0] || ''
  return url ? getImageUrl(url) : ''
})

const shopName = computed(() => shopInfo.value?.name || '')

const goSetting = () => {
  router.push({name: 'sys-setting'})
}

// 次级操作按钮配置（一行 4 个，超出的默认折叠）
const subActions = [
  { key: 'type-manage', label: '分类管理', icon: 'cluster-o', action: () => {
    router.push({name: 'type-manage'})
  } },
  { key: 'cus-inventory', label: '客户清单', icon: 'orders-o', action: () => {
    globalData.value.cusInventoryNeedUpdate = true
    router.push({name: 'cus-inventory'})
  } },
  { key: 'staff-manage', label: '人员管理', icon: 'manager-o', action: () => {
    router.push({name: 'staff-manage'})
  } },
  { key: 'sys-setting', label: '图册设置', icon: 'setting-o', action: () => {
    goSetting()
  } },
  { key: 'mul-manage', label: '批量管理', icon: 'apps-o', action: () => {
    router.push({name: 'product-manage', params: {shopId}})
    globalData.value.editStatus = 1;
  } },
  { key: 'home-mod', label: '首页装饰', icon: 'wap-home-o', action: () => {
    router.push({name: 'home-mod', params: {shopId}})
  } },

]

const SUB_VISIBLE_COUNT = 4

// 锁屏预览用的模拟柱状图
const fakeBars = [42, 66, 54, 80, 62, 92, 72]

const subExpanded = ref(false)

const showSubToggle = computed(() => subActions.length > SUB_VISIBLE_COUNT)

const visibleSubActions = computed(() => (
  subExpanded.value ? subActions : subActions.slice(0, SUB_VISIBLE_COUNT)
))

const usedCount = computed(() => globalData.value.usage?.total ?? 0)

const limit = computed(() => globalData.value.usage?.limit ?? 0)

// 不限量（无上限或 9999 表示不限）
const isUnlimited = computed(() => !limit.value || limit.value === 9999)

const limitText = computed(() => (isUnlimited.value ? '不限' : `${limit.value}`))

const showProgress = computed(() => !isUnlimited.value)

const percent = computed(() => {
  if (isUnlimited.value || !limit.value) return 0
  return Math.min(100, Math.round((usedCount.value / limit.value) * 100))
})

// 已超出上限（如 173/50）
const isOverLimit = computed(() => !isUnlimited.value && usedCount.value > limit.value)

const isExpired = computed(() => {
  const time = vipInfo.value?.expiredTime
  if (!time) return false
  return time * 1000 < Date.now()
})

// 会员等级回显，取自 E_vip_map
const vipItem = computed(() => {
  const level = vipInfo.value?.level
  if (level === undefined || level === null) return null
  return E_vip_map.find((item) => item.level === level) || null
})

const levelName = computed(() => vipItem.value?.name || '普通用户')

// 会员是否有效（是会员且未过期）
const isVipActive = computed(() => {
  if (globalData.value.rid === 99) return true
  return !!vipItem.value?.isVip && !isExpired.value
})

// 会员行右侧的轻量标签：未开通会员 / 到期时间
const expireText = computed(() => {
  if (!vipItem.value?.isVip) return '未开通会员'
  const time = vipInfo.value?.expiredTime
  if (!time) return '永久有效'
  const date = new Date(time * 1000)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const text = `${date.getFullYear()}-${month}-${day}`
  return isExpired.value ? `已于 ${text} 到期` : `${text} 到期`
})

// 最高等级（优先取会员配置里的最大 level）
const maxLevel = computed(() => {
  const cfg = vipInfo.value?.cfg
  if (Array.isArray(cfg) && cfg.length) {
    return Math.max(...cfg.map((item) => item.level))
  }
  return Math.max(...E_vip_map.map((item) => item.level))
})

// 是否已是最高等级会员
const isTopLevel = computed(() => isVipActive.value && vipInfo.value?.level === maxLevel.value)

// 升级按钮文案：''-不展示、开通、续费、升级
const upgradeText = computed(() => {
  if (!vipItem.value?.isVip) return '了解会员' // 未开通
  if (isExpired.value) return '续费' // 已过期
  if (isTopLevel.value) return '' // 最高等级，隐藏
  return '升级'
})

const showUpgradeBtn = computed(() => !!upgradeText.value)

const upgradeClass = computed(() => {
  if (upgradeText.value === '续费') return 'is-renew'
  if (upgradeText.value === '升级') return 'is-upgrade'
  return 'is-open'
})

const toAddProd = () => {
  router.push({name: 'product-edit'})
}

const toShare = () => {
  toShareAlbum(shopInfo.value)
}

const btnClickHandle = ({action}) => {
  action && action()

}

const gotoVip = () => {
  toVip(shopId)
}


const init = async () => {
  try {
    const [vipList, shopList] = await Promise.all([
      vipInfoManage.getData(shopId).catch(() => []),
      shopInfoManage.getData(shopId).catch(() => [])
    ])
    if (vipList?.[0]) vipInfo.value = vipList[0]
    if (shopList?.[0]) shopInfo.value = shopList[0]
  } catch (e) {
    console.error(e)
  } finally {
    vipLoaded.value = true
  }
}

onMounted(() => {
  init()
})
</script>

<script>
export default {
  name: 'Workbench'
}
</script>

<style scoped lang="scss">
.view-workbench {
  padding-bottom: $footerBarH;

  /* 顶部概览：深色会员卡 */
  .overview {
    position: relative;
    overflow: hidden;
    padding: $pdH;
    border-radius: 18px;
    background: linear-gradient(135deg, #1d2745 0%, #2a3a64 55%, #354f80 100%);
    box-shadow: 0 10px 24px rgba(29, 39, 69, 0.28);
    margin-bottom: $mrM;

    /* 卡内光晕 */
    .ov-light {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    .ov-light-1 {
      top: -56px;
      right: -40px;
      width: 160px;
      height: 160px;
      background: radial-gradient(circle, rgba(247, 208, 138, 0.32) 0%, rgba(247, 208, 138, 0) 68%);
    }

    .ov-light-2 {
      right: 40px;
      bottom: -70px;
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, rgba(122, 165, 255, 0.28) 0%, rgba(122, 165, 255, 0) 70%);
    }

    /* 会员徽标底纹 */
    .ov-badge {
      position: absolute;
      top: -18px;
      right: 14px;
      font-size: 120px;
      color: rgba(247, 208, 138, 0.1);
      pointer-events: none;
    }

    /* 图册封面 + 名称 / 会员等级 + 设置入口 */
    .ov-album {
      position: relative;
      display: flex;
      align-items: center;

      .album-cover {
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.22);
      }

      .album-info {
        flex: 1;
        min-width: 0;
        margin-left: $mrM;

        .album-name {
          font-size: $fsH;
          font-weight: bold;
          color: #fff;
          letter-spacing: 0.2px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        /* 会员等级行 */
        .level-line {
          display: flex;
          align-items: center;
          margin-top: 5px;
          min-width: 0;
        }

        .level-chip {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          max-width: 60%;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: $fsL;
          font-weight: bold;
          color: #ffe6b8;
          background: rgba(247, 208, 138, 0.16);
          border: 1px solid rgba(247, 208, 138, 0.38);

          /* 未开通 / 已过期：降为灰调 */
          &.is-plain {
            color: rgba(255, 255, 255, 0.72);
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.18);
          }

          .level-icon {
            margin-right: 3px;
            font-size: 12px;
          }

          .level-name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .status-dot {
            width: 5px;
            height: 5px;
            flex-shrink: 0;
            margin-left: 5px;
            border-radius: 50%;
            background: #3ddc97;

            &.is-expired {
              background: rgba(255, 255, 255, 0.4);
            }
          }
        }

        .expire-tag {
          margin-left: 6px;
          font-size: $fsL;
          color: rgba(255, 255, 255, 0.55);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .album-setting {
        flex-shrink: 0;
        margin-left: $mrL;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 17px;
        color: rgba(255, 255, 255, 0.9);
        background: rgba(255, 255, 255, 0.12);
        transition: background 0.2s ease;

        &:active {
          background: rgba(255, 255, 255, 0.22);
        }
      }
    }

    /* 容量行：产品容量 173/600 + 升级 */
    .ov-capacity {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: $pdH;
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.09);
      border: 1px solid rgba(255, 255, 255, 0.1);

      .cap-left {
        display: flex;
        align-items: baseline;
        min-width: 0;
      }

      .cap-label {
        margin-right: 6px;
        font-size: $fsM;
        color: rgba(255, 255, 255, 0.6);
      }

      .cap-value {
        display: inline-flex;
        align-items: baseline;

        .num {
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          letter-spacing: 0.5px;

          &.is-over {
            color: #ff9b7a;
          }
        }

        .sep {
          margin: 0 2px;
          color: rgba(255, 255, 255, 0.35);
        }

        .total {
          font-size: $fsM;
          color: rgba(255, 255, 255, 0.55);
        }
      }
    }

    .ov-btn {
      flex-shrink: 0;
      margin-left: $pdL;
      padding: 7px 16px;
      border-radius: 999px;
      font-size: $fsL;
      font-weight: bold;
      color: #7a4b12;
      background: linear-gradient(135deg, #ffe0a6 0%, #e9b866 100%);
      box-shadow: 0 4px 10px rgba(233, 184, 102, 0.35);
      transition: transform 0.15s ease;

      &:active {
        transform: scale(0.96);
      }

      /* 未开通 */
      &.is-open {
        color: #fff;
        background: linear-gradient(135deg, #6b9bff 0%, #2f5fe0 100%);
        box-shadow: 0 4px 10px rgba(47, 95, 224, 0.4);
      }

      /* 已过期，续费 */
      &.is-renew {
        color: #fff;
        background: linear-gradient(135deg, #ff9b7a 0%, #e8532f 100%);
        box-shadow: 0 4px 10px rgba(232, 83, 47, 0.4);
      }
    }

    /* 容量进度条 */
    .ov-progress {
      position: relative;
      height: 3px;
      margin-top: 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      overflow: hidden;

      .ov-progress-inner {
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #ffe0a6 0%, #e9b866 100%);
        box-shadow: 0 0 6px rgba(233, 184, 102, 0.6);
        transition: width 0.4s ease;

        &.is-over {
          background: linear-gradient(90deg, #ff9b7a 0%, #e8532f 100%);
          box-shadow: 0 0 6px rgba(232, 83, 47, 0.6);
        }
      }
    }
  }

  /* 快捷操作：整体卡片包裹 */
  .action-area {
    background: $bgWhite;
    border-radius: 18px;
    box-shadow: 0 6px 18px rgba(29, 39, 69, 0.06);
    padding: $pdH;

    .primary-actions {
      display: flex;
      gap: $mrM;
      .action-btn.primary {
        flex: 1;
        min-width: 0;
        height: 52px;
        border: none;
        border-radius: 14px;
        font-size: $fsH;
        font-weight: bold;
        letter-spacing: 0.3px;
        transition: transform 0.15s ease;

        &:active {
          transform: scale(0.97);
        }

        &.add-prod {
          box-shadow: 0 6px 16px rgba(47, 95, 224, 0.28);
        }

        &.share-album {
          box-shadow: 0 6px 16px rgba(6, 182, 99, 0.24);
        }

        :deep(.van-button__icon) {
          font-size: 19px;
        }
      }
    }

    /* 一行 4 个宫格 */
    .sub-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $mrM $mrL;
      margin-top: $pdM;
      :deep(.van-button__text) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .action-btn.sub {
        width: 100%;
        height: auto;
        min-width: 0;
        padding: 6px 0;
        border: none;
        background: transparent;
        box-shadow: none;
        transition: transform 0.15s ease;

        &:active {
          transform: scale(0.94);
        }

        :deep(.van-button__content) {
          flex-direction: column;
          align-items: center;
        }

        .sub-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          font-size: 20px;
          color: #fff;
          box-shadow: 0 4px 10px rgba(29, 39, 69, 0.12);
        }

        .sub-title {
          margin-top: 6px;
          font-size: $fsL;
          color: $grey6;
          white-space: nowrap;
        }

        /* 宫格图标循环配色 */
        &:nth-child(4n + 1) .sub-icon {
          background: linear-gradient(135deg, #7aa5ff 0%, #3d6ff2 100%);
        }
        &:nth-child(4n + 2) .sub-icon {
          background: linear-gradient(135deg, #ffc16b 0%, #f59231 100%);
        }
        &:nth-child(4n + 3) .sub-icon {
          background: linear-gradient(135deg, #5fe0a8 0%, #14b77a 100%);
        }
        &:nth-child(4n + 4) .sub-icon {
          background: linear-gradient(135deg, #b799ff 0%, #7a5cf0 100%);
        }
      }
    }

    /* 展开 / 收起 */
    .action-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: $pdM;
      padding-top: $pdM;
      border-top: 1px solid $bgGrey3;
      font-size: $fsL;
      color: $grey7;

      .toggle-icon {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }

  /* 图表区域 */
  .chart-content {
    margin: $mrM $mrM 0;
  }

  /* 未开通会员：数据分析开通引导 */
  .novip-opera-analysis {
    position: relative;
    overflow: hidden;
    padding: $pdH;
    border-radius: 18px;
    background: $bgWhite;
    box-shadow: 0 6px 18px rgba(29, 39, 69, 0.06);

    /* 数据预览：模糊柱状图 + 锁罩 */
    .lock-preview {
      position: relative;
      height: 122px;
      padding: 12px 14px;
      border-radius: 14px;
      overflow: hidden;
      background: linear-gradient(135deg, #1d2745 0%, #2a3a64 55%, #354f80 100%);

      .lock-bars {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        width: 100%;
        height: 100%;
        opacity: 0.6;
        filter: blur(1.5px);

        span {
          flex: 1;
          border-radius: 6px 6px 2px 2px;
          background: linear-gradient(180deg, #ffe0a6 0%, rgba(233, 184, 102, 0.2) 100%);
        }
      }

      .lock-mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(19, 26, 46, 0.42);

        .lock-icon {
          font-size: 22px;
          color: #ffe0a6;
        }

        .lock-text {
          margin-top: 6px;
          font-size: $fsL;
          color: rgba(255, 255, 255, 0.92);
        }
      }
    }

    /* 前往了解会员权益 */
    .learn-btn {
      height: 32px;
      margin-top: $mrM;
      padding: 0 16px;
      border: none;
      border-radius: 999px;
      font-size: $fsL;
      font-weight: bold;
      color: #7a4b12;
      background: linear-gradient(135deg, #ffe0a6 0%, #e9b866 100%);
      box-shadow: 0 4px 10px rgba(233, 184, 102, 0.45);
      transition: transform 0.15s ease;

      &:active {
        transform: scale(0.96);
      }

      :deep(.van-button__icon) {
        font-size: 12px;
      }
    }
  }
}
</style>
