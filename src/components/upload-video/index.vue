<template>
  <div class="com-upload-video">
    <div class="video-display" v-if="isShowMask">
      <div class="close" @click="delHandle" v-if="isShowDel">
        <VanIcon name="cross" />
      </div>

      <!-- 1. 上传中状态：整合了圆形进度条 -->
      <template v-if="uploadings.length">
        <div class="icon-content">
          <VanIcon name="video-o" />
        </div>
        <div class="mask uploading-mask">
          <VanCircle
            v-model:current-rate="currentRate"
            :rate="progress"
            :speed="100"
            size="48px"
            stroke-width="60"
            layer-color="#ebedf0"
            color="#1989fa"
          >
            <div class="progress-text">{{ progress }}%</div>
          </VanCircle>
        </div>
      </template>

      <!-- 2. 上传完成/已有视频状态 -->
      <template v-if="modelValue">
        <div class="icon-content">
          <VanIcon :name="isChecking ? 'clock-o' : 'play-circle-o'" />
        </div>
        <div class="mask" @click="viewVideoHandle">
          <span v-if="isChecking" class="check-text">审核中</span>
        </div>
      </template>
    </div>

    <!-- 3. 上传触发器 -->
    <VanUploader
      v-if="iShowUpload"
      accept="video/*"
      :max-count="1"
      :max-size="maxSize"
      :after-read="afterRead"
      @oversize="onOversize"
      preview-size="16vw"
      :disabled="disabled"
    />
    <DialogVideo ref="dialogVideo" />

    <!-- 🌟 统一的会员限制引导弹窗 -->
    <VanDialog
      v-model:show="dialogState.show"
      :title="dialogState.title"
      show-cancel-button
      confirm-button-text="前往了解"
      cancel-button-text="好的"
      confirm-button-color="#1989fa"
      @confirm="toVip(shopId)"
    >
      <div class="vip-dialog-content">
        <!-- 场景一：时长超限 -->
        <template v-if="dialogState.type === 'duration'">
          <div class="limit-row">
            <span>视频限长：</span>
            <span class="highlight-blue">{{ second2ViewTxt(globalData?.usage?.videoLimitS) }}</span>
          </div>
          <div class="limit-row">
            <span>本次上传时长：</span>
            <span class="highlight-red">{{ dialogState.currentDuration }}秒</span>
          </div>
        </template>

        <!-- 场景二：体积超限 -->
        <template v-else-if="dialogState.type === 'size'">
          <div class="limit-row">
            <span>最高支持时限：</span>
            <span class="highlight-blue">{{ second2ViewTxt(globalData?.usage?.videoLimitS) }}</span>
          </div>
          <div class="limit-row">
            <span>最大体积限制：</span>
            <span class="highlight-blue">{{ maxSizeText }}</span>
          </div>
        </template>
        <div class="tip-text" v-if="!isNoLimit">提示：升级会员，解锁更长视频上传！</div>
      </div>
    </VanDialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { showToast } from 'vant'; 
import { useRoute } from 'vue-router'
import { uploadMedia, sleep, second2ViewTxt, toVip } from '@/util'
import DialogVideo from '@/components/dialog-video/index.vue'
import { globalData } from '@/store'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: {type: Boolean, default: false}
});

const emit = defineEmits(['update:modelValue']);

const route = useRoute()
const shopId = +route.params.shopId

const dialogVideo = ref()
const uploadings = ref([])

// 上传进度相关的响应式数据
const progress = ref(0)      
const currentRate = ref(0)   

// 🌟 新增：统一管理弹窗的有状态响应式对象
const dialogState = reactive({
  show: false,
  type: 'duration', // 'duration' | 'size'
  title: '',
  currentDuration: 0
})

// 判断是否正在审核中
const isChecking = computed(() => {
  return /\.check/.test(props.modelValue)
})

const isShowMask = computed(() => {
  if (uploadings.value.length) return true
  if (props.modelValue) return true
  return false
})

const iShowUpload = computed(() => {
  if (isShowMask.value) return false
  return true
})

// 上传处理逻辑
const afterRead = async (file) => {
  uploadings.value.push(file)
  progress.value = 0 
  currentRate.value = 0

  file.status = 'uploading';
  file.message = '上传中...';

  try {
    const uploadRet = await uploadMedia({
      file: file.file, shopId,
      onProgress: (progressData) => {
        let percent = progressData.percent || 0;
        if (percent < 1) {
          percent = Math.floor(percent * 100);
        } else {
          percent = Math.floor(percent);
        }
        const nextProgress = Math.min(percent, 99);
        if (nextProgress > progress.value) {
          progress.value = nextProgress;
        }
      }
    })
    
    // 这里的 res 需要和原逻辑统一使用响应结果
    const { status, key, duration, msg } = uploadRet
    
    if (status === 1) { // 视频时长超出
      uploadings.value = []
      // 🌟 唤起组件弹窗
      dialogState.type = 'duration'
      dialogState.title = '⏰ 视频时长超限'
      dialogState.currentDuration = duration || 0
      dialogState.show = true
      return
    }
    
    if (status !== 0) {
      throw new Error(msg || '系统繁忙，请联系管理员～')
    }
    
    const isEffect = uploadings.value.find((item) => item === file)
    if (!isEffect) return
    
    progress.value = 100
    file.status = 'done'
    file.message = '上传成功'
    
    emit('update:modelValue', key) // 修正之前拼错的 res.data.key 隐患
    setTimeout(() => { uploadings.value = [] }, 300)

  } catch (error) {
    file.status = 'failed';
    file.message = '上传失败';
    emit('update:modelValue', '')
    uploadings.value = []
    showToast(error.message || '视频上传失败，请稍后重试');
  }
};

const delHandle = async () => {
  if (props.modelValue) {
    emit('update:modelValue', '')
  }
  if (uploadings.value.length) {
    uploadings.value = []
  }
}

const maxSize = computed(() => {
  const { videoLimitS = 0 } = globalData.value.usage
  let ret = videoLimitS * 1.5 * 1024 * 1024
  // return 1024 * 1024 * 1
  return ret || 50 * 1024 * 1024
})

const maxSizeText = computed(() => {
  return `${Math.floor(maxSize.value / (1024 * 1024))} MB`
})

// 🌟 体积超限拦截：同样统一收拢至弹窗组件
const onOversize = () => {
  dialogState.type = 'size'
  dialogState.title = '视频体积超限'
  dialogState.show = true
};

const isShowDel = computed(() => {
  if (uploadings.value.length) return true
  if (props.modelValue) return true
  return false
})

const viewVideoHandle = async () => {
  if (isChecking.value) {
    showToast('视频审核中～');
    return
  }
  const playableUrl = props.modelValue.replace(/\.check$/, '.mp4')
  dialogVideo.value.show({ url: playableUrl })
}

const isLoading = () => {
  if (uploadings.value.length) return true
  return false
}

const beforeReadHandle = () => {
  console.log(999)
  return false
}

const isNoLimit = computed(() => {
  const { videoLimit } = globalData.value.usage
  if (videoLimit === 9999) return true
  return false
})

defineExpose({ isLoading })
</script>

<style lang="scss" scoped>
.com-upload-video {
  :deep(.van-uploader__upload) {
    margin: 0;
  }
  
  // 🌟 优雅紧凑的弹窗自定义类目
  .vip-dialog-content {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start; // 保证横向不对齐拉伸，靠左排布
    color: #323233;
    font-size: 14px;

    .limit-row {
      margin-bottom: 8px;
      line-height: 1.4;
      
      .highlight-blue {
        color: #1989fa;
        font-weight: 600;
      }
      
      .highlight-red {
        color: #ee0a24;
        font-weight: 600;
      }
    }

    .tip-text {
      color: #969799;
      font-size: 12px;
      margin-top: 6px;
    }
  }

  .video-display {
    width: 60px;
    height: 60px;
    position: relative;
    border-radius: 8px; 
    overflow: hidden;

    .close {
      position: absolute;
      top: 1px;
      right: 1px;
      width: 16px;
      height: 16px;
      color: #fff;
      background: black;
      border-radius: 50%;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5; 
    }

    .icon-content {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      font-size: 32px;
      color: #969799;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .check-text {
      color: #fff;
      font-size: 10px;
      background: rgba(237, 106, 12, 0.85); 
      padding: 2px 6px;
      border-radius: 10px;
      transform: scale(0.9);
    }
  }

  .uploading-mask {
    background: rgba(0, 0, 0, 0.7) !important; 
    
    .progress-text {
      color: #ffffff;
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      line-height: 48px; 
    }
  }
}
</style>