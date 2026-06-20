<template>
  <!-- 1. 产品视频开关 -->
  <VanField center class="vant-field-tit_width50" :readonly="true">
    <template #label>
      <div class="custom-label">
        <span class="main-title">产品视频</span>
      </div>
    </template>
    <template #right-icon>
      <VanSwitch v-model="videoEnabled" />
    </template>
  </VanField>

  <!-- 2. 上传视频区域（开启后可见） -->
  <VanField 
    v-if="videoEnabled" 
    label="上传视频" 
    class="upload-field"
    :rules="[{validator: checkParams}]"
  >
    <template #input>
      <!-- 主容器改为纵向，方便承载下方的提示语 -->
      <div class="video-upload-wrapper">
        
        <!-- 上半部分：左右同行对齐 -->
        <div class="upload-row-container">
          <!-- 左侧：上传组件 -->
          <UploadVideo v-model="urlDisplay" class="upload-box" ref="uploadVideoRef" :disabled="disabled" />
          
          <!-- 右侧：干净的容量与按钮卡片 -->
          <div 
            class="count-limit-inline" 
            :class="{'is-max-lv': isNoLimit }"
            @click="handleLimitClick"
          >
            <div class="limit-text-area">
              <!-- 标题增加问号图标，并绑定阻止冒泡的点击事件 -->
              <div class="title-container" @click.stop="showCapacityTip">
                <span class="title">视频容量</span>
                <van-icon name="question-o" class="tip-icon" />
              </div>
              
              <div class="num-info">
                <template v-if="isNoLimit">
                  <span class="num-highlight unlimited">{{ usageInfo.videoNum }}</span>
                </template>
                <template v-else>
                  <span class="num-highlight">{{ usageInfo.videoNum }}</span>
                  <span class="split">/</span>
                  <span class="total-num">{{ usageInfo.videoLimit }}</span>
                </template>
              </div>
            </div>
            
            <!-- 右侧动作按钮 -->
            <div class="right-action-zone">
              <div v-if="!isNoLimit" class="vip-guide" @click="toVip(shopId)">
                <span>去升级</span>
                <van-icon name="arrow" class="guide-arrow" />
              </div>
              <div v-else class="vip-tag">
                <van-icon name="gem-o" />
                <span class="vip-text">无限制</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-duration-tip">
          <van-icon name="info-o" />
          <span>当前支持上传最长 {{ second2ViewTxt(globalData.usage.videoLimitS) }} 视频</span>
        </div>
      </div>
    </template>
  </VanField>

  <VanCell 
    v-if="videoEnabled"
    title="视频封面" 
    is-link 
    :value="coverModeText"
    @click="showActionSheet = true"
  />
  <VanField
    readonly
    v-if="isShowCustomCover"
  >
    <template #label>
      <FormLabel label="上传封面">

      </FormLabel>
    </template>
    <template #input>
      <UploadImgs v-model="coverDisplay" ref="uploadImgsRef"/>
    </template>
  </VanField>

  <VanActionSheet
    v-model:show="showActionSheet"
    :actions="coverActions"
    cancel-text="取消"
    close-on-click-action
    @select="onSelectCoverMode"
  />

  <!-- 🌟 新增：常驻规则说明弹窗 -->
  <VanDialog
    v-model:show="isTipDialogShow"
    title="视频容量说明"
    confirm-button-text="我知道了"
    confirm-button-color="#1989fa"
  >
    <div class="capacity-dialog-content">
      该容量为<strong>图册总视频额度</strong>，单个产品最多支持上传 1 个视频。
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, computed, } from 'vue';
import { useRoute } from 'vue-router'
import UploadVideo from '@/components/upload-video/index.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { showToast } from 'vant'
import { globalData } from '@/store'
import { toVip, second2ViewTxt } from '@/util'

const props = defineProps({
  url: { type: String, default: '' },
  cover: { type: String, default: '' },
  status: { type: Number, default: 0 },
  disabled: {type: Boolean, default: false}
})

const emits = defineEmits(['update:status', 'update:url', 'update:cover'])

const route = useRoute()
const shopId = +route.params.shopId

const usageInfo = computed(() => {
  const { videoNum = 0, videoLimit = 0, videoLimitS = 0 } = globalData.value.usage
  return {videoNum, videoLimit, videoLimitS}
})

const videoEnabled = computed({
  get() { return props.status === 1 },
  set(val) { emits('update:status', val ? 1 : 0) }
})

const urlDisplay = computed({
  get() { return props.url },
  set(val) { emits('update:url', val) }
})

const coverDisplay = computed({
  get() { return props.cover },
  set(val) { emits('update:cover', val) }
})

// 控制底部选择面板的显示与隐藏
const showActionSheet = ref(false)

// 动作面板的可选项列表
const coverActions = [
  { name: '默认第一帧', value: 'default' },
  { name: '自定义', value: 'custom' }
]

// 内部计算属性：用来直观展示当前 Cell 的选中状态
const coverModeText = computed(() => {
  for (const item of coverActions) {
    if (item.value === coverModeDisplay.value) return item.name
  }
  return coverActions[0].name
})

const coverMode = ref('default') // 封面模式，default-视频首帧、custom-自定义
const coverModeDisplay = computed(() => {
  if (props.cover) return 'custom'
  return coverMode.value
})

const isShowCustomCover = computed(() =>{
  if (!videoEnabled.value) return false
  if (coverModeDisplay.value === 'custom') return true
  return  false
})


// 选择封面模式的处理逻辑
const onSelectCoverMode = (action) => {
  if (action.value === 'default') {
    emits('update:cover', '')
  }
  coverMode.value = action.value
}

const handleLimitClick = () => {

}

// 🌟 新增：控制常驻弹窗显隐的变量与方法
const isTipDialogShow = ref(false)
const showCapacityTip = () => {
  isTipDialogShow.value = true
}

const uploadVideoRef = ref()
const uploadImgsRef = ref()
const checkParams = () => {
  const isLoading = uploadVideoRef.value.isLoading()
  if (isLoading) {
    showToast('请等待视频上传完成～')
    return '请等待视频上传完成～'
  }
  if (!props.url) return '请上传视频'
  if (coverModeDisplay.value === 'custom') {
    if (uploadImgsRef.value.isLoading) {
      showToast('请等待封面上传完成～')
      return '请等待封面上传完成～'
    }
    if (!props.cover) return '请上传封面'
  }
  return true
}

const isNoLimit = computed(() => { // 是否无限容量
  return usageInfo.value.videoLimit === 9999
})

</script>

<script>
export default {
  name: 'VideoCfg'
}
</script>

<style lang="scss" scoped>
.custom-label {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  .main-title {
    font-size: 14px;
    color: #323233;
    font-weight: 500;
  }
}

.upload-field {
  :deep(.van-field__control--custom) {
    align-items: flex-start; 
  }
}

// 主包裹容器
.video-upload-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

// 左右同行布局
.upload-row-container {
  display: flex;
  align-items: center; 
  width: 100%;

  .upload-box {
    flex-shrink: 0; 
  }
  
  // 右侧容量卡片
  .count-limit-inline {
    flex: 1; 
    height: 60px;
    padding: 0 8px;
    background: #f7f8fa;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    margin-left: 12px;

    .limit-text-area {
      display: flex;
      flex-direction: column; 
      
      // 标题与 Icon 的对齐布局
      .title-container {
        display: flex;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        
        .title {
          font-size: 12px; 
          color: #969799; 
          white-space: nowrap; 
        }

        .tip-icon {
          font-size: 13px;
          color: #c8c9cc;
          
          &:active {
            color: #1989fa;
          }
        }
      }

      .num-info {
        font-size: 12px;
        color: #c8c9cc;
        display: flex;
        align-items: baseline; 
        margin-top: 2px;
        
        .num-highlight {
          color: #323233;
          font-weight: bold;
          line-height: 1;
          
          &.unlimited {
            font-size: 15px;
            color: #be903f;
          }
        }
        .split {
          margin: 0 4px;
        }
        .total-num {
          font-weight: 500;
          color: #7d7e80;
        }
      }
    }

    // 右侧升级按钮区域
    .right-action-zone {
      flex-shrink: 0;
      display: flex;
      align-items: center;

      .vip-guide {
        font-size: 12px;
        color: #ed6a0c;
        background: #fffbe8;
        padding: 4px 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        font-weight: 500;

        .guide-arrow {
          font-size: 10px;
          margin-left: 2px;
        }
      }

      .vip-tag {
        font-size: 12px;
        color: #be903f;
        display: flex;
        align-items: center;
        background: #fbf6ec;
        padding: 4px 8px;
        border-radius: 6px;
        
        .vip-text {
          font-size: 11px;
          margin-left: 3px;
          font-weight: 500;
        }
      }
    }

    &.is-max-lv {
      background: #fbf6ec;
      border: 1px solid #f3e5cb;
    }
  }
}

// 底部常驻中文时长提示样式
.bottom-duration-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  color: #969799; 
  padding-left: 2px;
  line-height: 1.4;
}

// 🌟 新增：说明弹窗的排版样式
.capacity-dialog-content {
  padding: 26px 24px;
  font-size: 14px;
  color: #646566;
  line-height: 1.5;
  text-align: center;
  
  strong {
    color: #323233;
    font-weight: 600;
  }
}
</style>