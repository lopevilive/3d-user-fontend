<template>
  <VanDialog
    v-model:show="isShow"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <div class="over-tips">
      <!-- 无 VIP 信息：仅提示大小限制 -->
      <template v-if="!shopId || !vipInfo">
        <div class="tip-icon">⚠️</div>
        <p class="tip-text">当前最大支持上传 {{ maxSize }}M 的图片</p>
      </template>

      <!-- 有 VIP 信息 -->
      <template v-else>
        <!-- level === 0：未开通 -->
        <template v-if="currentLevel === 0">
          <p class="tip-text">当前为免费版，图片大小限制 {{ curCfg?.imgS || '-' }}M，数量限制 {{ curCfg?.imgC || '-' }}张</p>
          <p class="tip-text-desc">开通会员可提升上传限制</p>
          <VanButton size="small" type="primary" round class="vip-btn" @click="goVip">前往了解</VanButton>
        </template>

        <!-- level > 0 && level < 6：已开通但未满级 -->
        <template v-if="currentLevel > 0 && currentLevel < 6">
          <p class="tip-text">当前会员等级图片大小限制 {{ curCfg?.imgS || '-' }}M，数量限制 {{ curCfg?.imgC || '-' }}张</p>
          <p class="tip-text-desc">升级会员获取更高限制</p>
          <VanButton size="small" type="primary" round class="vip-btn" @click="goVip">前往了解</VanButton>
        </template>

        <!-- level === 6：最高等级 -->
        <template v-if="currentLevel === 6">
          <p class="tip-text-desc">图片大小上限 {{ curCfg?.imgS }}M，数量上限 {{ curCfg?.imgC }}张</p>
          <VanButton size="small" type="primary" round class="vip-btn" @click="closeDialog">好的</VanButton>
        </template>
      </template>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { toVip, vipInfoManage } from '@/util'

const route = useRoute()

const shopId = +route.params.shopId

const isShow = ref(false)
const maxSize = ref(0)
const vipInfo = ref(null)

const currentLevel = computed(() => vipInfo.value?.level ?? 0)
const curCfg = computed(() => {
  if (!vipInfo.value?.cfg) return null
  return vipInfo.value.cfg.find(c => c.level === currentLevel.value) || null
})

const show = async (m) => {
  maxSize.value = m
  vipInfo.value = null

  if (shopId) {
    try {
      const vipRet = await vipInfoManage.getData(shopId)
      vipInfo.value = vipRet[0] || null
    } catch (e) {
      vipInfo.value = null
    }
  }

  isShow.value = true
}

const goVip = () => {
  if (shopId) toVip(shopId)
  isShow.value = false
}

const closeDialog = () => {
  isShow.value = false
}

defineExpose({show})
</script>

<style scoped lang="scss">
.over-tips {
  padding: 28px 20px 20px;
  text-align: center;
  color: $grey7;
  font-size: $fsM;

  .tip-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }

  .tip-text {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 600;
    color: #323233;
    line-height: 1.5;
  }

  .tip-text-desc {
    margin: 0 0 16px;
    font-size: 13px;
    color: #969799;
    line-height: 1.5;
  }

  .vip-btn {
    min-width: 120px;
  }
}
</style>
