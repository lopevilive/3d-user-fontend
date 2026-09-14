<template>
  <van-cell-group inset :title="title">
    <div
      ref="listRef"
      class="collapse-cell-list"
      :class="[`show-${showCount}`, { 'is-collapsed': !expanded, 'has-toggle': hasMore }]"
    >
      <slot />
    </div>
    <VanCell v-if="hasMore" clickable class="collapse-cell-toggle" @click="toggle">
      <template #title>
        <div class="toggle-wrap">
          <span>{{ expanded ? collapseText : expandText }}</span>
          <span v-if="!expanded" class="toggle-count">({{ extraCount }})</span>
          <VanIcon class="toggle-icon" :name="expanded ? 'arrow-up' : 'arrow-down'" />
        </div>
      </template>
    </VanCell>
  </van-cell-group>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  // 分组标题
  title: { type: String, default: '' },
  // 收起状态默认显示的 cell 数量
  defaultShow: { type: Number, default: 4 },
  // 展开/收起文案
  expandText: { type: String, default: '展开更多' },
  collapseText: { type: String, default: '收起' }
})

// nth-child 需要静态数字，故按 show-n 类名列举，最多支持 12 个展示位
const MAX_SHOW = 12

const listRef = ref(null)
const expanded = ref(false)
const totalCount = ref(0)
let observer = null

const showCount = computed(() => Math.min(Math.max(props.defaultShow || 1, 1), MAX_SHOW))
const hasMore = computed(() => totalCount.value > showCount.value)
const extraCount = computed(() => Math.max(totalCount.value - showCount.value, 0))

// 取插槽直接渲染出来的 cell 元素
const getCells = () => {
  if (!listRef.value) return []
  return Array.from(listRef.value.children).filter(
    el => el.classList && el.classList.contains('van-cell')
  )
}

// 仅用于统计数量决定是否显示“展开更多”，显隐由 CSS 的 nth-child 控制
const countCells = () => {
  totalCount.value = getCells().length
}

const toggle = () => {
  expanded.value = !expanded.value
}

onMounted(() => {
  countCells()
  // 由 v-if 控制的 cell 会随数据加载增减，需要重新统计
  observer = new MutationObserver(countCells)
  observer.observe(listRef.value, { childList: true })
})

onBeforeUnmount(() => {
  observer && observer.disconnect()
  observer = null
})
</script>

<!-- 显隐依赖 nth-child，必须使用非 scoped 样式，避免被 Vue 重设 className 影响 -->
<style lang="scss">
.collapse-cell-list {
  @for $i from 1 through 12 {
    &.is-collapsed.show-#{$i} > .van-cell:nth-child(n + #{$i + 1}) {
      display: none;
    }
  }
  // 内容区后面还有展开按钮时，保留最后一项的分割线
  &.has-toggle > .van-cell:last-child::after {
    display: block;
  }
}
</style>

<style lang="scss" scoped>
.collapse-cell-toggle {
  :deep(.van-cell__title) {
    flex: none;
    width: 100%;
  }
  .toggle-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $btnText;
    font-size: $fsL;
    .toggle-count {
      margin-left: 4px;
      color: $grey9;
    }
    .toggle-icon {
      margin-left: 2px;
      font-size: $fsL;
    }
  }
}
</style>
