<template>
  <div class="batch-page">
    <!-- 左侧 -->
    <div class="upload-panel">
      <div class="upload-card">
        <div class="upload-icon-area">
          <IconUpload class="upload-icon" />
        </div>

        <h2 class="upload-title">批量上传产品</h2>
        <p class="upload-desc">
          支持 .zip 格式，内含 Excel 与图片文件夹，单文件最大 500MB
        </p>

        <a-upload
          :auto-upload="false"
          :show-file-list="false"
          accept=".zip"
          :multiple="false"
          @change="onZipSelected"
          class="upload-trigger"
          :disabled="uploading"
        >
          <template #upload-button>
            <button class="upload-main-btn" :class="{ uploading }">
              <IconUpload />
              <span>{{ uploading ? '上传中…' : '选择 ZIP 文件' }}</span>
            </button>
          </template>
        </a-upload>

        <div v-if="uploading" class="progress-area">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ uploadProgress }}%</span>
        </div>

        <button class="template-btn" @click.stop="downloadTemplate">
          <IconDownload />
          <span>下载示例模板</span>
        </button>
      </div>

      <section class="spec-section file-structure">
        <h3 class="section-title">📁 文件结构</h3>
        <ul class="rule-list">
          <li>
            <span class="label">Excel 格式：</span>
            第一行为表头，从第二行开始为产品数据
          </li>
          <li>
            <span class="label">产品主图命名：</span>
            与 Excel 行号对应。如第
            <span class="num">5</span> 行产品，图片命名为
            <span class="code">5_1</span>、<span class="code">5_2</span>
          </li>
          <li>
            <span class="label">产品详情图命名（选填）：</span>
            如需详情图，用
            <span class="code">{行}_desc_{序号}</span>
            格式。如第 <span class="num">5</span> 行产品 →
            <span class="code">5_desc_1</span>、<span class="code">5_desc_2</span>
          </li>
          <li>
            <span class="label">文件夹：</span>
            图片统一放入一个文件夹，与 Excel 一同打包
          </li>
        </ul>
      </section>
    </div>

    <!-- 右侧：字段说明 -->
    <div class="spec-panel">
      <div class="spec-panel__content">
        <div class="panel-header">
          <IconInfoCircle class="panel-icon" />
          <span>字段说明</span>
        </div>

        <section class="spec-section">
          <!-- 分类 -->
          <div class="field-block">
            <p class="field-label">分类（选填）</p>
            <p class="field-text">
              直接填写分类名称；二级分类用
              <span class="code">/</span> 分隔，如
              <span class="code">家具/沙发</span>。<br />
              一个产品可属于多个分类，多分类用
              <span class="code">|</span> 分隔，如
              <span class="code">家具/沙发|真皮沙发</span>
            </p>
          </div>

          <!-- 规格组 -->
          <div class="field-block">
            <p class="field-label">规格组（选填）</p>
            <p class="field-text">
              格式：
              <span class="code">规格名:值1,值2|规格名2:值3,值4</span>
              <br />
              示例：
              <span class="code">颜色:红色,黄色,绿色|尺寸:S,M</span>
              → 两组规格
            </p>
          </div>

          <!-- 价格 -->
          <div class="field-block">
            <p class="field-label">价格（选填）</p>

            <!-- 1 -->
            <p class="rule-line">
              <span class="rule-head">1. 单一产品（无颜色/尺寸）</span>
              ，填数字即售价，如 <span class="code">299</span>
            </p>

            <!-- 2 -->
            <p class="rule-line">
              <span class="rule-head">2. 有多个款式</span>
            </p>

            <!-- 2.1 -->
            <div class="sub-rule">
              <p class="rule-line">
                <span class="rule-head">2.1 统一定价</span>
                ，填一个数字，所有款式同价
              </p>
            </div>

            <!-- 2.2 -->
            <div class="sub-rule">
              <p class="rule-line">
                <span class="rule-head">2.2 不同款式不同价格</span>
                — <span class="code">款式值1:价格|款式值2:价格</span>
              </p>

              <div class="example-box">
                <p class="example-title">📌 示例</p>

                <div class="example-item">
                  <p class="ex-desc">按颜色不同价</p>
                  <p class="ex-code">红色:100|黄色:150</p>
                  <p class="ex-result">
                    → 红色=100，黄色=150；绿色可不定价
                  </p>
                </div>

                <div class="example-item">
                  <p class="ex-desc">按颜色+尺寸不同价</p>
                  <p class="ex-code">红色,S:100|红色,M:120</p>
                  <p class="ex-result">
                    → 红色、S码=100，红色、M码=120；其余不定价
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 产品属性 -->
          <div class="field-block">
            <p class="field-label">产品属性（选填）</p>
            <p class="field-text">
              自定义键值对，格式：
              <span class="code">属性名:属性值|属性名2:属性值2</span>
              <br />
              示例：
              <span class="code">品牌:阿迪达斯|风格:简约</span>
              → 品牌=阿迪达斯，风格=简约
            </p>
          </div>

          <!-- 内部备注 -->
          <div class="field-block">
            <p class="field-label">内部备注（选填）</p>
            <p class="field-text">
              键值对格式，仅内部可见：
              <span class="code">属性名:属性值|属性名2:属性值2</span>
              <br />
              示例：
              <span class="code">进货价:80|供应商:XX厂</span>
              → 进货价 80 元，供应商为 XX 厂
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconUpload, IconDownload, IconInfoCircle } from '@arco-design/web-vue/es/icon'
import { Button as AButton, Upload as AUpload } from '@arco-design/web-vue'
import { uploadZip } from '@/util/cos'
import { processBatchZip, validBatchUploadToken } from '@/http'
import { commonFetch } from '@/util'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  shopId: { type: Number, default: 0 }
})

const uploading = ref(false)
const uploadProgress = ref(0)



const startZipProcess = async (cosFileName) => {
  const taskId = await commonFetch(processBatchZip, {shopId: props.shopId, cosFileName})
  // const taskId = '55b0ff6ac84641ab8a9d9a6058040db1';
  router.replace({ query: { ...route.query, taskId } })
  setTimeout(() => {
    location.reload()
  }, 500);
}

// Arco Upload 选择了文件后的处理
const onZipSelected = async (fileList) => {
  if (uploading.value) return // 上传中禁止重复选择
  const file = fileList?.[0]?.file
  if (!file) return
  if (!file.name.endsWith('.zip')) {
    Message.warning('请选择 .zip 格式')
    return
  }
  const MAX_SIZE = 500 * 1024 * 1024 // 500MB
  if (file.size > MAX_SIZE) {
    Message.warning('文件大小超过 500MB 限制，请重新选择')
    return
  }

  // 校验 token 是否有效
  try {
    const {ticket} = route.query
    if (!ticket) {
      Message.warning('链接已失效，请重新复制链接')
      return
    }
    await commonFetch(validBatchUploadToken, {ticket})
  } catch (e) {
    Message.warning('链接已失效，请重新复制链接')
    return
  }

  if (!props.shopId) return Message.warning('参数有误，请联系管理员')

  uploading.value = true
  uploadProgress.value = 0

  try {
    const cosFileName = await uploadZip(file, props.shopId , (p) => {
      uploadProgress.value = p
    })
    // console.log(cosFileName)
    // const cosFileName = 'zip/5_3_1784653580454.zip'
    uploadProgress.value = 100
    startZipProcess(cosFileName)

  } catch (err) {
    Message.error(err?.msg || 'ZIP 上传失败，请重试')
  } finally {
    uploading.value = false
  }
}

// 下载示例模板
const downloadTemplate = () => {
  const link = document.createElement('a')
  link.href = '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0%E7%A4%BA%E4%BE%8B.zip'
  // link.download = '批量上传模版.zip'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped lang="scss">
.batch-page {
  min-height: 100vh;
  display: flex;
  gap: 28px;
  padding: 48px 56px;
  background: #f5f7fb;
  box-sizing: border-box;
  align-items: flex-start;
  margin: 0 auto;
}

/* ========== 左侧 ========== */
.upload-panel {
  width: 420px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-card {
  background: #fff;
  border-radius: 20px;
  padding: 40px 36px;
  box-shadow: 0 8px 30px rgba(47, 84, 235, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-icon-area {
  width: 80px;
  height: 80px;
  border-radius: 22px;
  background: linear-gradient(135deg, #eef1ff, #dfe6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;

  .upload-icon {
    font-size: 36px;
    color: #2f54eb;
  }
}

.upload-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 8px;
}

.upload-desc {
  font-size: 13px;
  color: #86909c;
  text-align: center;
  margin: 0 0 28px;
  line-height: 1.6;
}

.upload-trigger {
  width: 100%;
}

.upload-main-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2f54eb, #1d39c4);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover { opacity: 0.92; }
  &.uploading { background: #bfc8f7; cursor: default; }
}

.progress-area {
  width: 100%;
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;

  .progress-bar {
    flex: 1;
    height: 8px;
    background: #e8edf3;
    border-radius: 4px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: #2f54eb;
      border-radius: 4px;
    }
  }

  .progress-text {
    font-size: 13px;
    font-weight: 600;
    color: #2f54eb;
    min-width: 36px;
  }
}

.template-btn {
  margin-top: 22px;
  background: none;
  border: none;
  color: #2f54eb;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* ========== 文件结构（左侧下方） ========== */
.file-structure {
  background: #fff;
  border-radius: 20px;
  padding: 24px 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.file-structure .section-title {
  font-size: 14px;
  font-weight: 600;
  color: #4e5969;
  margin: 0 0 14px;
}

.file-structure .rule-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    font-size: 13px;
    color: #4e5969;
    line-height: 1.75;
    padding-left: 14px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2f54eb;
    }
  }
}

.file-structure .label {
  font-weight: 600;
  color: #1d2129;
}

.file-structure .code {
  display: inline;
  background: #f0f5ff;
  color: #2f54eb;
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-family: "SF Mono", monospace;
}

.file-structure .num {
  font-weight: 600;
  color: #1d2129;
}

/* ========== 右侧 ========== */
.spec-panel {
  flex: 1;
  width: 640px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .spec-panel__content {
    height: 100%;
    overflow-y: auto;
  }
}

.panel-header {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  .panel-icon {
    color: #2f54eb;
    font-size: 18px;
  }
}

.spec-section {
  margin-bottom: 26px;

  &:last-child { margin-bottom: 0; }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #4e5969;
  margin: 0 0 14px;
}

.rule-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    font-size: 13px;
    color: #4e5969;
    line-height: 1.75;
    padding-left: 14px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 9px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #2f54eb;
    }
  }
}

.label {
  font-weight: 600;
  color: #1d2129;
}

.code {
  display: inline;
  background: #f0f5ff;
  color: #2f54eb;
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-family: "SF Mono", monospace;
}

.num {
  font-weight: 600;
  color: #1d2129;
}

/* ========== 字段块 ========== */
.field-block {
  margin-bottom: 18px;
  padding-left: 12px;
  border-left: 3px solid #e8edf3;

  &:last-child { margin-bottom: 0; }
}

.field-label {
  font-size: 13px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 6px;
}

.field-text {
  font-size: 13px;
  color: #4e5969;
  line-height: 1.75;
  margin: 0;
}

/* ========== 规则层级 ========== */
.rule-line {
  font-size: 13px;
  color: #4e5969;
  line-height: 1.8;
  margin: 0 0 6px;
}

.rule-head {
  font-weight: 600;
  color: #f53f3f;
}

.sub-rule {
  margin: 4px 0 14px 16px;
  padding-left: 12px;
  border-left: 3px solid #dde4ff;
}

/* ========== 示例 ========== */
.example-box {
  margin-top: 10px;
  background: #f9fafc;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #e8edf3;
}

.example-title {
  font-size: 13px;
  font-weight: 600;
  color: #1d2129;
  margin: 0 0 10px;
}

.example-item {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  border: 1px dashed #d9e1ec;

  &:last-child { margin-bottom: 0; }
}

.ex-desc {
  font-size: 13px;
  color: #4e5969;
  margin: 0 0 6px;
}

.ex-code {
  display: block;
  background: #f0f5ff;
  color: #2f54eb;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-family: "SF Mono", monospace;
  margin-bottom: 6px;
  word-break: break-all;
}

.ex-result {
  font-size: 12px;
  color: #86909c;
  margin: 0;
}
</style>