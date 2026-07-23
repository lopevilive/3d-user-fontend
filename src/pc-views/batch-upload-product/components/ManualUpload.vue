<template>
  <div class="manual-wrap">
    <!-- 顶部工具栏 -->
    <div class="pu-toolbar">
      <div class="toolbar-left">
        <a-button
          :disabled="!list.length"
          variant="outline"
          status="danger"
          @click="clearAll"
          class="action-btn"
        >
          <template #icon><IconDelete /></template>
          清空列表
        </a-button>
      </div>
      <div class="toolbar-right">
        <a-button
          type="primary"
          :disabled="!list.length"
          @click="mockUpload"
          class="submit-btn"
        >
          <template #icon><IconUpload /></template>
          开始批量上传（{{ list.length }}）
        </a-button>
      </div>
    </div>

    <!-- 容器主区域 -->
    <div class="pu-main-container">
      <!-- 固定表头 -->
      <div class="pu-thead">
        <div class="pu-th pu-col-index">序号</div>
        <div class="pu-th pu-col-desc">产品描述</div>
        <div class="pu-th pu-col-cate">
          <span>产品分类</span>
          <a-tooltip position="top" content="产品分类，二级分类使用“/”分隔。&#10;例如：家具展示/沙发">
            <IconInfoCircle class="cate-tip-icon" />
          </a-tooltip>
        </div>
        <div class="pu-th pu-col-price">产品价格</div>
        <div class="pu-th pu-col-status">是否上架</div>
        <div class="pu-th pu-col-img">
          <span>产品图片</span>
          <a-tooltip position="top" content="支持拖拽图片调整顺序">
            <IconInfoCircle class="cate-tip-icon" />
          </a-tooltip>
        </div>
        <div class="pu-th pu-col-act">操作</div>
      </div>

      <!-- 列表区域 -->
      <div class="pu-body">
        <a-list
          ref="listRef"
          :data="list"
          :bordered="false"
          :split="false"
          :virtualListProps="{
            height: '100%',
            fixedSize: true,
            itemHeight: ROW_H,
            threshold: 10,
          }"
        >
          <template #item="{ item, index }">
            <div class="pu-tr" :class="{ 'pu-tr-even': index % 2 === 1 }">
              <!-- 序号 -->
              <div class="pu-td pu-col-index">
                <span class="index">{{ index + 1 }}</span>
              </div>

              <!-- 产品描述 -->
              <div class="pu-td pu-col-desc">
                <a-textarea
                  v-model="item.description"
                  placeholder="请输入产品描述"
                  :max-length="800"
                  :auto-size="{ minRows: 1, maxRows: 3 }"
                  allow-clear
                  class="custom-textarea fill-input"
                  show-word-limit
                />
              </div>

              <!-- 产品分类 -->
              <div class="pu-td pu-col-cate">
                <a-input v-model="item.category" placeholder="产品分类（选填）" allow-clear class="custom-input fill-input" />
              </div>

              <!-- 产品价格 -->
              <div class="pu-td pu-col-price">
                <a-input v-model="item.price" placeholder="价格（选填）" allow-clear class="custom-input fill-input">
                </a-input>
              </div>

              <!-- 是否上架 -->
              <div class="pu-td pu-col-status">
                <a-switch
                  v-model="item.status"
                  :checked-value="1"
                  :unchecked-value="0"
                  checked-color="#2f54eb"
                >
                  <template #checked>上架</template>
                  <template #unchecked>下架</template>
                </a-switch>
              </div>

              <!-- 产品图片 -->
              <div class="pu-td pu-col-img">
                <Container
                  orientation="horizontal"
                  behaviour="move"
                  drag-class="img-drag"
                  drop-class="img-drop"
                  class="pu-imgs"
                  @drop="e => onImgDrop(e, index)"
                >
                  <Draggable
                    v-for="(img, i) in item.images"
                    :key="img.uid"
                    class="pu-img"
                  >
                    <img :src="img.previewUrl" />
                    <!-- 上传中遮罩 -->
                    <div v-if="img.uploading" class="img-uploading-overlay">
                      <IconLoading class="uploading-spin" />
                    </div>
                    <div class="img-overlay">
                      <div class="overlay-action preview-center" @click.stop="openPreview(index, i)">
                        <IconEye />
                      </div>
                      <div class="overlay-action delete-topright" @click.stop="rmImg(index, i)">
                        <IconClose />
                      </div>
                    </div>
                  </Draggable>

                  <a-upload
                    :show-file-list="false"
                    accept="image/*"
                    :multiple="true"
                    :auto-upload="false"
                    :on-before-upload="(file) => afterReadHandle(file, index)"
                  >
                    <template #upload-button>
                      <div class="pu-img-add">
                        <IconPlus class="add-icon" />
                        <span class="add-text">添加</span>
                      </div>
                    </template>
                  </a-upload>
                </Container>
              </div>

              <!-- 操作 -->
              <div class="pu-td pu-col-act">
                <a-button type="text" status="danger" class="delete-row-btn" @click="rmRow(index)">
                  <template #icon><IconClose /></template>
                  删除
                </a-button>
              </div>
            </div>
          </template>
        </a-list>
      </div>
    </div>

    <!-- 底部区域 -->
    <div class="pu-footer">
      <a-button type="outline" size="large" class="add-btn" @click="addRow">
        <template #icon><IconPlus /></template>
        添加单行产品
      </a-button>
    </div>

    <a-image-preview-group
      v-model:visible="previewVisible"
      v-model:current="previewCurrent"
      infinite
      :srcList="previewSrcList"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconUpload, IconPlus, IconClose, IconInfoCircle, IconEye, IconDelete, IconLoading
} from '@arco-design/web-vue/es/icon'
import {
  Button as AButton,
  Upload as AUpload,
  Input as AInput,
  Textarea as ATextarea,
  Tooltip as ATooltip,
  List as AList,
  Empty as AEmpty,
  ImagePreviewGroup as AImagePreviewGroup,
  Switch as ASwitch
} from '@arco-design/web-vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { rand } from '@/util'

/* ========== 常量与状态 ========== */
const ROW_H = 92
const list = ref([])
const listRef = ref(null)

const previewVisible = ref(false)
const previewCurrent = ref(0)
const previewSrcList = ref([])

/* ========== 数据操作 ========== */
const makeRow = () => ({
  id: `${Date.now()}_${Math.random()}`,
  images: [],
  description: '',
  category: '',
  price: '',
  status: 1,
})

const addRow = async () => {
  list.value.push(makeRow())
  await nextTick()
  requestAnimationFrame(() => {
    listRef.value?.scrollIntoView({
      index: list.value.length - 1,
      align: 'bottom',
    })
  })
}

const rmRow = i => {
  const r = list.value[i]
  r.images.forEach(x => x.previewUrl && URL.revokeObjectURL(x.previewUrl))
  list.value.splice(i, 1)
}

const onImgDrop = (dropResult, rowIndex) => {
  const { removedIndex, addedIndex } = dropResult
  if (removedIndex == null || addedIndex == null) return
  const imgs = list.value[rowIndex].images
  const [moved] = imgs.splice(removedIndex, 1)
  imgs.splice(addedIndex, 0, moved)
}

const openPreview = (rowIndex, imgIndex) => {
  const row = list.value[rowIndex]
  if (!row || !row.images.length) return
  previewSrcList.value = row.images.map(img => img.previewUrl)
  previewCurrent.value = imgIndex
  previewVisible.value = true
}

const uploadDemoApi = async (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const num = rand(1,100)
      if (num >= 1) {
        resolve({ url: URL.createObjectURL(file), key: `demo/${Date.now()}_${file.name}` })
      } else {
        reject(new Error('上传失败，请重试'))
      }
    }, 2000);
  })
}

// afterReadHandle：a-upload 选中文件后调用，处理上传逻辑
const afterReadHandle = async (file, rowIndex) => {
  const row = list.value[rowIndex]
  if (!row) return false

  // 去重
  const exist = row.images.some(
    e => e.file?.name === file.name && e.file?.size === file.size
  )
  if (exist) return false

  // 添加本地预览
  const uid = `${Date.now()}_${Math.random()}`
  const previewUrl = URL.createObjectURL(file)
  const imgItem = { uid, file, previewUrl, uploading: true }
  row.images.push(imgItem)

  // 调用模拟上传接口
  try {
    const res = await uploadDemoApi(file)
    // ✅ 通过 uid 从数组中取到 Proxy 对象再修改，才能触发响应式更新
    const target = row.images.find(item => item.uid === uid)
    if (target) {
      target.uploading = false
      target.url = res.url
      target.key = res.key
    }
  } catch (err) {
    URL.revokeObjectURL(previewUrl)
    const failIdx = row.images.findIndex(item => item.uid === uid)
    if (failIdx !== -1) row.images.splice(failIdx, 1)
    Message.error(`${file.name} 上传失败`)
  }

  return false // 阻止 a-upload 的默认上传行为
}

const rmImg = (ri, ii) => {
  const img = list.value[ri].images[ii]
  if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)
  list.value[ri].images.splice(ii, 1)
}

const clearAll = () => {
  Modal.confirm({
    title: '确认清空列表？',
    content: '清空后所有未上传的产品数据将被移除，且无法恢复。',
    okText: '确认清空',
    cancelText: '取消',
    okButtonProps: { status: 'danger', size: 'medium' },
    cancelButtonProps: { size: 'medium' },
    onOk: () => {
      list.value.forEach(r =>
        r.images.forEach(img => img.previewUrl && URL.revokeObjectURL(img.previewUrl))
      )
      list.value = []
      Message.success('列表已清空')
    },
  })
}

const mockUpload = () => Message.success('开始上传（模拟）')



</script>

<style scoped lang="scss">
.manual-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pu-toolbar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 20px;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toolbar-right { margin-left: auto; }
  .action-btn {
    border-color: var(--color-neutral-3, #e5e6eb);
    color: var(--color-text-2, #4e5969);
  }
  .submit-btn {
    background: linear-gradient(135deg, #2f54eb 0%, #1d39c4 100%);
    border: none;
    font-weight: 500;
    box-shadow: 0 4px 10px rgba(47, 84, 235, 0.2);
  }
}

.pu-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  min-height: 0;
}

.pu-thead {
  display: flex;
  align-items: center;
  height: 44px;
  background: #fafbfe;
  border-bottom: 1px solid #edf1f6;
  flex-shrink: 0;
}

.pu-th {
  padding: 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: #1d2129;
  display: flex;
  align-items: center;
  box-sizing: border-box;
}

.pu-col-index { width: 65px; flex-shrink: 0; justify-content: center; text-align: center; }
.pu-col-desc  { flex: 1.6; min-width: 180px; }
.pu-col-cate  { width: 170px; flex-shrink: 0; }
.pu-col-price { width: 155px; flex-shrink: 0; }
.pu-col-status { width: 130px; flex-shrink: 0; justify-content: center; }
.pu-col-img   { width: 230px; flex-shrink: 0; }
.pu-col-act   { width: 90px; flex-shrink: 0; justify-content: center; }

.pu-body {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  :deep(.arco-list-wrapper) {
    height: 100%;
    .arco-list-spin {
      height: 100%;
      .arco-scrollbar {
        height: 100%;
        .arco-scrollbar-container {
          height: 100%;
          .arco-list-content-wrapper {
            height: 100%;
          }
        }
      }
    }
  }
}

.pu-tr {
  display: flex;
  align-items: center;
  height: 92px;
  padding: 0;
  border-bottom: 1px solid #f2f5f8;
  box-sizing: border-box;

  &:hover {
    background-color: #f7f9fc !important;
  }
}

.pu-td {
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
}

.fill-input {
  flex: 1;
  width: 100%;
}

.pu-col-index .index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #f0f3f7;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.custom-input {
  :deep(.arco-input-wrapper) {
    background-color: #f4f6f9;
    border: 1px solid transparent;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

    &:hover { background-color: #eaedf2; }
    &.arco-input-focus {
      background-color: #ffffff;
      border-color: #2f54eb;
      box-shadow: 0 0 0 3px rgba(47, 84, 235, 0.12);
    }
  }
  :deep(.arco-input-prefix) {
    color: #86909c;
    font-weight: 500;
    margin-right: 4px;
  }
}

.custom-textarea {
  :deep(.arco-textarea-wrapper) {
    background-color: #f4f6f9;
    border: 1px solid transparent;
    border-radius: 6px;
    padding-left: 10px;
    padding-right: 10px;
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

    &:hover { background-color: #eaedf2; }
    &.arco-textarea-focus {
      background-color: #ffffff;
      border-color: #2f54eb;
      box-shadow: 0 0 0 3px rgba(47, 84, 235, 0.12);
    }
  }
  :deep(.arco-textarea-word-limit) {
    color: #86909c;
    font-size: 11px;
  }
}

.pu-imgs {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
  flex: 1;

  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
}

.pu-img {
  width: 52px;
  height: 52px !important;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  cursor: grab;
  border: 1px solid #e2e8f0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  .img-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(1px);
    opacity: 0;
    transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    pointer-events: none;

    .overlay-action {
      pointer-events: auto;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .preview-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%) scale(1.1);
      }
    }

    .delete-topright {
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 10px;
      width: 14px;
      height: 14px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.3);

      &:hover {
        background: #f53f3f;
        transform: scale(1.05);
      }
    }
  }

  .img-uploading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    .uploading-spin {
      font-size: 20px;
      color: #ffffff;
      animation: pu-spin 1s linear infinite;
    }
  }

  &:hover .img-overlay { opacity: 1; }
}

@keyframes pu-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pu-img-add {
  width: 52px;
  height: 52px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  .add-icon { font-size: 12px; color: #64748b; }
  .add-text { font-size: 9px; color: #94a3b8; }

  &:hover {
    border-color: #2f54eb;
    background: #f5f7ff;
  }
}

.delete-row-btn {
  font-size: 13px;
  color: #86909c !important;
  padding: 4px 8px;
  &:hover {
    color: #f53f3f !important;
    background-color: #ffeceb !important;
  }
}

.empty-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pu-footer {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn {
  width: 220px;
  height: 40px;
  border-radius: 6px;
  color: #2f54eb;
  border-color: #adc6ff;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(47, 84, 235, 0.05);
  &:hover {
    color: #ffffff;
    background: #2f54eb;
    border-color: #2f54eb;
  }
}

.cate-tip-icon {
  margin-left: 4px;
  color: #86909c;
  cursor: pointer;
  &:hover { color: #2f54eb; }
}
</style>
