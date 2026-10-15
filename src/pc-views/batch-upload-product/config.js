// ===== 批量上传相关配置 =====

// 示例文件（ZIP）下载地址
export const TEMPLATE_URL = '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E7%A4%BA%E4%BE%8B.zip'

// 引导弹窗“近期不再提示”的 localStorage key
export const NO_TIP_KEY = 'batchUploadGuideNoTip'

// ★ 勾选“近期不再提示”后的静默时长（单位：毫秒）
// 默认 1 天 = 24 * 60 * 60 * 1000，如需调整提示间隔只改这一处
export const NO_TIP_DURATION = 1 * 24 * 60 * 60 * 1000

// 是否处于“近期不再提示”的有效期内
export const isNoTipValid = () => {
  const expire = Number(localStorage.getItem(NO_TIP_KEY) || 0)
  if (!expire) return false
  return Date.now() < expire
}

// 记录“近期不再提示”（写入过期时间戳）
export const setNoTip = () => {
  localStorage.setItem(NO_TIP_KEY, `${Date.now() + NO_TIP_DURATION}`)
}

// 清除“近期不再提示”记录
export const clearNoTip = () => {
  localStorage.removeItem(NO_TIP_KEY)
}

// 下载示例文件
export const downloadTemplate = () => {
  const link = document.createElement('a')
  link.href = TEMPLATE_URL
  // link.download = '批量上传模版.zip'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
