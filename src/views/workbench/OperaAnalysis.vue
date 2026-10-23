<template>
  <div class="view-com-opera-analysis">
    <!-- 时间范围选择 + 刷新 -->
    <div class="panel-head">
      <div class="range-bar">
        <div
          v-for="item in rangeOptions"
          :key="item.type"
          class="range-item"
          :class="{ 'is-active': recordType === item.type }"
          @click="changeRange(item.type)"
        >{{ item.label }}</div>
      </div>

      <div class="refresh-btn" :class="{ 'is-loading': loading }" @click="refreshHandle">
        <VanIcon name="replay" />
      </div>
    </div>

    <!-- 统计起始时间提示 -->
    <div class="data-tip">
      <VanIcon name="info-o" class="tip-icon" />
      <span>数据从 {{ dataStartDate }} 开始统计</span>
    </div>

    <div class="analysis-loading" v-if="loading">
      <VanLoading size="22px" vertical>加载中...</VanLoading>
    </div>

    <template v-else>
      <!-- 概览数据：访问人数 / 打开次数（管理员 + 普通用户合并统计） -->
      <div class="summary">
        <div class="summary-item">
          <div class="summary-label">{{ memberLabel }}</div>
          <div class="summary-value">
            {{ totalMember }}<span class="unit">人</span>
          </div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-label">{{ openTimesLabel }}</div>
          <div class="summary-value">
            {{ totalOpenTimes }}<span class="unit">次</span>
          </div>
        </div>
      </div>

      <!-- 折线图：仅近 7 天 / 近 30 天展示，今天不展示 -->
      <template v-if="recordType !== 1">
        <div class="chart-head">
          <div class="chart-title">访问趋势</div>
        </div>

        <div class="chart-wrap" v-show="dailyList.length">
          <div ref="chartRef" class="line-chart"></div>
        </div>

        <div class="chart-empty" v-if="!dailyList.length">
          <VanEmpty image="search" description="暂无访问数据" />
        </div>
      </template>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { throttle } from '@/util'
import { fetchViewRecord } from '@/http'

echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const route = useRoute()
const shopId = +route.params.shopId

// 时间范围：1-今天、2-近7天、3-近30天
const rangeOptions = [
  { type: 1, label: '今天' },
  { type: 2, label: '近7天' },
  { type: 3, label: '近30天' }
]

// 统计数据起始日期（后端从该日期开始记录）
const dataStartDate = '2026年10月19日'

const recordType = ref(2)
const rawList = ref([])
const loading = ref(false)
const cache = {}

// ========== 数据整理 ==========
// logTs 为秒级时间戳（兼容毫秒），格式化为 M/D
const formatDate = (ts) => {
  if (!ts) return ''
  const time = ts > 1e12 ? ts : ts * 1000
  return dayjs(time).format('M/D')
}

// 转数字，非法值按 0 处理
const toNumber = (val) => {
  const num = Number(val)
  return Number.isFinite(num) ? num : 0
}

// data 可能是空对象 / 字符串；即便 data 有值，admin、custom 也可能单独缺失
const normalizeData = (raw) => {
  let data = raw
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      data = {}
    }
  }
  if (!data || typeof data !== 'object') data = {}
  const admin = data.admin && typeof data.admin === 'object' ? data.admin : {}
  const custom = data.custom && typeof data.custom === 'object' ? data.custom : {}
  return {
    // admin.member：当天登录过的管理员数；custom.member：当天登录过的普通用户数
    member: toNumber(admin.member) + toNumber(custom.member),
    // 打开次数同理，管理员与普通用户合并为总数
    openTimes: toNumber(admin.openTimes) + toNumber(custom.openTimes)
  }
}

const dailyList = computed(() => {
  const list = Array.isArray(rawList.value) ? [...rawList.value] : []
  list.sort((a, b) => toNumber(a?.logTs) - toNumber(b?.logTs))
  return list.map((item) => ({
    label: formatDate(item?.logTs),
    ...normalizeData(item?.data)
  }))
})

// 今天只取最新一天的数据；近7天/近30天为区间内累计
const summaryList = computed(() => {
  const list = dailyList.value
  if (!list.length) return []
  if (recordType.value === 1) return [list[list.length - 1]]
  return list
})

const totalMember = computed(() => (
  summaryList.value.reduce((sum, item) => sum + item.member, 0)
))

const totalOpenTimes = computed(() => (
  summaryList.value.reduce((sum, item) => sum + item.openTimes, 0)
))

const memberLabel = computed(() => (recordType.value === 1 ? '今日访问人数' : '累计访问人数'))
const openTimesLabel = computed(() => (recordType.value === 1 ? '今日打开次数' : '累计打开次数'))

// ========== 折线图（ECharts） ==========
const chartRef = ref()
let chart = null

const getChartOption = () => {
  const labels = dailyList.value.map((item) => item.label)
  const showSymbol = labels.length <= 15

  return {
    animationDuration: 400,
    grid: { left: 34, right: 12, top: 32, bottom: 24 },
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(29, 39, 69, 0.9)',
      borderWidth: 0,
      textStyle: { color: '#fff', fontSize: 11 },
      axisPointer: { type: 'line', lineStyle: { color: 'rgba(61, 111, 242, 0.35)' } }
    },
    legend: {
      top: 0,
      right: 0,
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle',
      textStyle: { color: '#86909c', fontSize: 11 },
      data: ['访问人数', '打开次数']
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e5e8ef' } },
      axisLabel: { color: '#9aa3b2', fontSize: 10, hideOverlap: true }
    },
    yAxis: {
      type: 'value',
      minInterval: 1, // 人数/次数均为整数
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#eef1f6' } },
      axisLabel: { color: '#9aa3b2', fontSize: 10 }
    },
    series: [
      {
        name: '访问人数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol,
        itemStyle: { color: '#3d6ff2' },
        lineStyle: { width: 2, color: '#3d6ff2' },
        areaStyle: { color: 'rgba(61, 111, 242, 0.16)' },
        data: dailyList.value.map((item) => item.member)
      },
      {
        name: '打开次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol,
        itemStyle: { color: '#14b77a' },
        lineStyle: { width: 2, color: '#14b77a' },
        data: dailyList.value.map((item) => item.openTimes)
      }
    ]
  }
}

const disposeChart = () => {
  if (!chart) return
  chart.dispose()
  chart = null
}

const renderChart = async () => {
  // 今天不展示图表；无数据时不初始化
  if (recordType.value === 1 || !dailyList.value.length) {
    disposeChart()
    return
  }
  await nextTick()
  if (!chartRef.value) return
  if (!chart) chart = echarts.init(chartRef.value)
  chart.setOption(getChartOption(), true)
  chart.resize()
}

// 屏幕尺寸变化时自适应
const resizeHandle = throttle(() => {
  if (chart) chart.resize()
}, 200)

watch([dailyList, recordType, loading], () => {
  if (loading.value) {
    // 加载中图表容器会被卸载，先销毁实例
    disposeChart()
    return
  }
  renderChart()
}, { deep: true })

// ========== 数据请求 ==========
const fetchData = async (type) => {
  if (cache[type]) {
    rawList.value = cache[type]
    return
  }
  loading.value = true
  try {
    const ret = await fetchViewRecord({ shopId, recordType: type })
    const list = Array.isArray(ret?.data) ? ret.data : []
    cache[type] = list
    rawList.value = list
  } catch (e) {
    console.error(e)
    rawList.value = []
  } finally {
    loading.value = false
  }
}

const changeRange = (type) => {
  if (recordType.value === type) return
  recordType.value = type
  fetchData(type)
}

// 手动刷新：跳过缓存重新拉取当前时间范围的数据
const refreshHandle = () => {
  if (loading.value) return
  delete cache[recordType.value]
  fetchData(recordType.value)
}

onMounted(() => {
  window.addEventListener('resize', resizeHandle)
  fetchData(recordType.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandle)
  disposeChart()
})
</script>

<style lang="scss" scoped>
.view-com-opera-analysis {
  background: $bgWhite;
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(29, 39, 69, 0.06);
  padding: $pdH;
  min-height: 400px;

  /* 顶部：时间选择 + 刷新按钮 */
  .panel-head {
    display: flex;
    align-items: center;
    gap: $mrL;

    .range-bar {
      flex: 1;
      min-width: 0;
    }

    .refresh-btn {
      flex-shrink: 0;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 17px;
      color: $grey7;
      background: $bgGrey3;
      transition: background 0.2s ease;

      &:active {
        background: $bgGrey2;
      }

      &.is-loading :deep(.van-icon) {
        animation: refresh-spin 0.8s linear infinite;
      }
    }
  }

  @keyframes refresh-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* 时间选择 */
  .range-bar {
    display: flex;
    padding: 3px;
    border-radius: 10px;
    background: $bgGrey3;

    .range-item {
      flex: 1;
      padding: 7px 0;
      text-align: center;
      font-size: $fsL;
      color: $grey7;
      border-radius: 8px;
      transition: all 0.2s ease;

      &.is-active {
        color: #fff;
        font-weight: bold;
        background: linear-gradient(135deg, #6b9bff 0%, #2f5fe0 100%);
        box-shadow: 0 2px 6px rgba(47, 95, 224, 0.3);
      }
    }
  }

  .analysis-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    color: $grey7;
    font-size: $fsL;
  }

  /* 概览数据 */
  .summary {
    display: flex;
    align-items: center;
    margin-top: $pdH;
    padding: 14px 0;
    border-radius: 14px;
    background: #f7f9fc;

    .summary-item {
      flex: 1;
      text-align: center;
      min-width: 0;
    }

    .summary-divider {
      width: 1px;
      height: 28px;
      background: $bgGrey2;
    }

    .summary-label {
      font-size: $fsL;
      color: $grey7;
    }

    .summary-value {
      margin-top: 6px;
      font-size: 24px;
      font-weight: bold;
      line-height: 1.1;
      color: #1d2745;
    }

    .unit {
      margin-left: 3px;
      font-size: $fsL;
      font-weight: normal;
      color: $grey7;
    }
  }

  /* 图表 */
  .chart-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $pdH;

    .chart-title {
      font-size: $fsM;
      font-weight: bold;
      color: $grey;
    }
  }

  .chart-wrap {
    margin-top: $mrL;
  }

  .line-chart {
    width: 100%;
    height: 190px;
  }

  .chart-empty {
    padding: 30px 0;
  }

  /* 统计起始时间提示 */
  .data-tip {
    display: flex;
    align-items: center;
    margin-top: $mrL;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: $fsL;
    color: $grey7;
    background: #f7f9fc;

    .tip-icon {
      flex-shrink: 0;
      margin-right: 4px;
      font-size: 13px;
      color: #3d6ff2;
    }
  }
}
</style>
