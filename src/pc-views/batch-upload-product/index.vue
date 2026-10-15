<template>
  <div class="pu-batch">
    <!-- 移动端提示遮罩 -->
    <div v-if="showMobileTip" class="mobile-mask">
      <div class="mobile-tip-card">
        <div class="tip-icon">🖥</div>
        <div class="tip-title">请使用电脑访问</div>
        <div class="tip-desc">批量上传功能仅支持 PC 端浏览器打开，请使用电脑访问此页面。</div>
      </div>
    </div>

    <!-- ===== 手动上传（暂隐藏） ===== -->
    <!--
    <a-tabs v-model:activeKey="activeTab" class="pu-tabs" :tabBarGutter="0">
      <a-tab-pane key="manual">
        <template #title>
          <IconEdit class="tab-icon" />
          手动上传
        </template>
        <ManualUpload />
      </a-tab-pane>

      <a-tab-pane key="zip">
        <template #title>
          <IconFolder class="tab-icon" />
          ZIP上传
        </template>
        <ZipUpload />
      </a-tab-pane>
    </a-tabs>
    -->

    <!-- 链接过期提示 -->
    <div v-if="linkExpired" class="expired-mask">
      <div class="expired-tip-card">
        <div class="tip-icon">🔗</div>
        <div class="tip-title">链接已过期</div>
        <div class="tip-desc">当前链接已失效，请返回重新复制链接后再访问。</div>
      </div>
    </div>

    <!-- ZIP上传 -->
    <ZipUpload v-if="!linkExpired" :shopId="shopId" />

    <!-- 任务进度遮罩 -->
    <div v-if="showTaskMask" class="task-mask">
      <div class="task-card">
        <div class="task-title">
          <span v-if="taskPercent > 0 && taskPercent < 100" class="task-loading-spin"></span>
          正在导入数据...
        </div>
        <div class="task-progress">
          <div class="task-progress-bar" :style="{ width: taskPercent + '%' }"></div>
        </div>
        <div class="task-percent">{{ taskPercent > 0 ? taskPercent + '%' : '' }}</div>
        <div class="task-status-text" v-if="taskStatusText">{{ taskStatusText }}</div>
        <a-button v-if="taskDone" type="primary" size="large" class="task-close-btn" @click="showTaskMask = false">
          关闭
        </a-button>
      </div>
    </div>

    <!-- 示例文件引导弹窗 -->
    <div v-if="showGuide" class="guide-mask">
      <div class="guide-card">
        <div class="guide-icon">📦</div>
        <div class="guide-title">上传前请先下载示例文件</div>
        <div class="guide-desc">请先下载示例文件，按示例中的字段与命名规则整理好数据后，再打包上传。</div>

        <div class="guide-steps">
          <div class="guide-step" v-for="(item, idx) in guideSteps" :key="idx">
            <span class="step-index">{{ idx + 1 }}</span>
            <span class="step-text">{{ item }}</span>
          </div>
        </div>

        <div class="guide-footer">
          <a-button type="primary" size="large" @click="handleDownloadTemplate">
            下载示例文件
          </a-button>
          <div class="guide-right">
            <a-checkbox v-model="noTipChecked">近期不再提示</a-checkbox>
            <a-button size="large" @click="closeGuide">我知道了</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconEdit, IconFolder } from '@arco-design/web-vue/es/icon'
import { Tabs as ATabs, TabPane as ATabPane, Button as AButton, Checkbox as ACheckbox } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
import { mobileRegex, commonFetch } from '@/util'
import { isNoTipValid, setNoTip, downloadTemplate } from './config'
import ManualUpload from './components/ManualUpload.vue'
import ZipUpload from './components/ZipUpload.vue'
import {validBatchUploadToken, fetchBatchUploadTask} from '@/http'
import { globalData } from '@/store'


const route = useRoute()

const activeTab = ref('manual')
const showMobileTip = ref(false)
const linkExpired = ref(false)
const shopId = ref()


const showTaskMask = ref(false)
const taskDone = ref(false)
const taskPercent = ref(0)
const taskResult = ref(0)
const taskStatusText = ref('')

// 示例文件引导弹窗
const showGuide = ref(false)
const noTipChecked = ref(false)
const guideSteps = [
  '下载示例文件（ZIP 包），内含 Excel 模板与示例图片',
  '按示例填写 Excel 表头与产品数据，图片按行号命名',
  '将 Excel 与图片一起打包成 ZIP 后上传'
]

const handleDownloadTemplate = () => {
  downloadTemplate()
}

const closeGuide = () => {
  if (noTipChecked.value) setNoTip() // 勾选后记录静默到期时间，过期后再次提示
  showGuide.value = false
}

const startQueryBatchTask = async () => {
  const {taskId} = route.query
  if (!taskId) return

  showTaskMask.value = true
  taskPercent.value = 0
  taskResult.value = 0

  let done = false
  while (!done) {
    try {
      const ret = await fetchBatchUploadTask({taskId, shopId: shopId.value})
      const {status, finishedNum, totalNum, waitingNum} = ret.data || {}

      if (status === 0 || status === 4) {
        // 待开始或排队中
        const queueText = waitingNum > 0 ? `（前面还有 ${waitingNum} 个任务）` : ''
        taskStatusText.value = `排队中${queueText}`
        await new Promise(r => setTimeout(r, 2000))
        continue
      }

      if (status === 1) {
        // 进行中：计算进度
        const pct = totalNum > 0 ? Math.round((finishedNum / totalNum) * 100) : 0
        const displayPct = pct === 0 && finishedNum === 0 ? 1 : pct
        taskPercent.value = displayPct
        taskStatusText.value = ''
        await new Promise(r => setTimeout(r, 1500))
        continue
      }

      if (status === 2) {
        taskPercent.value = 100
        taskResult.value = finishedNum || 0
        taskStatusText.value = `✅ 成功导入 ${finishedNum || 0} 个产品`
        taskDone.value = true
        done = true
        break
      }

      if (status === 3) {
        taskPercent.value = totalNum > 0 ? Math.round((finishedNum / totalNum) * 100) : 0
        taskResult.value = finishedNum || 0
        taskStatusText.value = `⚠️ 任务中断，已导入 ${finishedNum || 0} 个产品`
        taskDone.value = true
        done = true
        break
      }
    } catch (e) {
      taskStatusText.value = '查询任务状态失败'
      taskDone.value = true
      done = true
    }
  }
}

onMounted(async () => {
  try {
    const ua = navigator.userAgent
    if (mobileRegex.test(ua)) {
      showMobileTip.value = true
      return
    }
    const {ticket} = route.query
    if (!ticket) {
      linkExpired.value = true
      return
    }
    const {shopId: sId, userId, token} = await commonFetch(validBatchUploadToken, {ticket})
    globalData.value.userInfo.userId = userId
    shopId.value = sId
    sessionStorage.setItem('token', token)
    // 非“近期不再提示”有效期内时，弹出示例文件引导
    if (!isNoTipValid()) showGuide.value = true
    startQueryBatchTask()
  } catch(e) {
    linkExpired.value = true
  }
})
</script>

<style scoped lang="scss">
.pu-batch {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f7f9; 
  padding: 16px 20px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.pu-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.arco-tabs-content) {
    flex: 1;
    overflow: hidden;
    padding: 0 !important;
    .arco-tabs-content-list {
      height: 100%;
      .arco-tabs-pane {
        height: 100%;
      }
    }
  }
  :deep(.arco-tabs-content-inner) {
    height: 100%;
  }
  :deep(.arco-tabs-nav) {
    margin-bottom: 16px;
  }
  :deep(.arco-tabs-nav-tab) {
    gap: 0;
  }
  :deep(.arco-tabs-tab) {
    padding: 8px 20px;
    font-size: 15px;
    border-radius: 8px 8px 0 0;
    transition: all 0.2s;

    .tab-icon {
      margin-right: 6px;
      font-size: 16px;
    }
  }
}
.mobile-mask,
.expired-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #f4f7f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px 48px;
  text-align: center;
  min-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  .task-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .task-loading-spin {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #e8edf3;
    border-top-color: #2f54eb;
    border-radius: 50%;
    animation: task-spin 0.7s linear infinite;
  }

  @keyframes task-spin {
    to { transform: rotate(360deg); }
  }

  .task-progress {
    height: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;

    .task-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #2f54eb, #597ef7);
      border-radius: 4px;
      transition: width 0.4s ease;
    }
  }

  .task-percent {
    font-size: 13px;
    color: #86909c;
    font-weight: 500;
  }

  .task-status-text {
    margin-top: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #1d2129;
    white-space: pre-wrap;
  }

  .task-close-btn {
    margin-top: 20px;
    min-width: 120px;
  }
}

.mobile-tip-card,
.expired-tip-card {
  text-align: center;
  padding: 48px 40px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  max-width: 340px;

  .tip-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .tip-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 12px;
  }

  .tip-desc {
    font-size: 14px;
    color: #86909c;
    line-height: 1.6;
  }
}

/* ========== 示例文件引导弹窗 ========== */
.guide-mask {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.guide-card {
  width: 520px;
  max-width: calc(100vw - 48px);
  box-sizing: border-box;
  padding: 32px 36px 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  text-align: center;

  .guide-icon {
    font-size: 40px;
    line-height: 1;
    margin-bottom: 12px;
  }

  .guide-title {
    font-size: 20px;
    font-weight: 600;
    color: #1d2129;
  }

  .guide-desc {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.6;
    color: #86909c;
  }

  .guide-steps {
    margin-top: 20px;
    padding: 16px 18px;
    border-radius: 12px;
    background: #f7f9fc;
    text-align: left;

    .guide-step {
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      line-height: 1.6;
      color: #4e5969;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      .step-index {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        margin-top: 1px;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        background: #2f54eb;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .guide-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24px;

    .guide-right {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: #86909c;
    }
  }
}
</style>
