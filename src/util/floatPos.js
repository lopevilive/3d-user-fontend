import { onMounted, onBeforeUnmount } from 'vue'
import { getFlexW, throttle } from './util'

// ===== 悬浮球（VanFloatingBubble）位置缓存公共逻辑 =====
// 场景：折叠屏展开/合上、横竖屏旋转后，屏幕尺寸变化会让缓存的历史坐标越界，
//      因此缓存里同时记录屏幕尺寸，尺寸差异过大时直接丢弃缓存用默认位置。

// 悬浮球尺寸（与 .share-float / .com-share-float 等的宽高保持一致）
export const FLOAT_SIZE = 30

// ★ 屏幕宽度差异阈值（px）：屏幕宽度变化超过该值时，认为缓存位置已不适用，
//   清空缓存并回到默认位置（可按需调整）
export const SCREEN_WIDTH_DIFF = 10

// 读取缓存：返回原始字符串与解析后的数据，解析失败时 data 为 null
export const readFloatPos = (key) => {
  const raw = localStorage.getItem(key)
  if (!raw) return {raw: null, data: null}
  try {
    return {raw, data: JSON.parse(raw)}
  } catch (e) {
    console.error(e)
    return {raw, data: null}
  }
}

// 缓存是否失效：无缓存 / 数据异常 / 旧缓存未记录屏幕尺寸 / 屏幕宽度变化过大
export const isFloatCacheInvalid = (data) => {
  if (!data) return true
  if (typeof data.x !== 'number' || typeof data.y !== 'number') return true
  if (!data.w) return true
  return Math.abs(window.innerWidth - data.w) >= SCREEN_WIDTH_DIFF
}

// 兜底：把位置限制在当前可视区域内，避免小屏时跑到屏幕外
export const clampFloatOffset = (x, y, gap = getFlexW(24)) => {
  const maxX = Math.max(window.innerWidth - FLOAT_SIZE - gap, 0)
  const maxY = Math.max(window.innerHeight - FLOAT_SIZE - gap, 0)
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY)
  }
}

// 保存位置，并记录当前屏幕尺寸，供下次进入 / 换屏时对比
export const saveFloatPos = (key, val) => {
  const x = parseInt(val?.x)
  const y = parseInt(val?.y)
  const data = {x, y, w: window.innerWidth, h: window.innerHeight}
  localStorage.setItem(key, JSON.stringify(data))
}

// 监听屏幕尺寸变化（折叠 / 旋转），触发回调重新计算悬浮球位置
export const bindScreenChange = (callback) => {
  const handler = throttle(callback, 300)
  onMounted(() => {
    window.addEventListener('resize', handler)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler)
  })
}

// 统一的位置计算：命中无效缓存时清空缓存并返回默认位置，否则返回缓存位置（已做边界兜底）
export const getFloatOffset = (key, defaultOffset, gap = getFlexW(24)) => {
  const {raw, data} = readFloatPos(key)
  if (isFloatCacheInvalid(data)) {
    if (raw) localStorage.removeItem(key)
    return defaultOffset
  }
  return clampFloatOffset(data.x, data.y, gap)
}
