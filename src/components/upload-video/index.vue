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
          <!-- 环形进度条：圈住加载状态，显示具体百分比 -->
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
          <!-- 如果是审核中(.check)，换成时钟图标暗示等待，更直观 -->
          <VanIcon :name="isChecking ? 'clock-o' : 'play-circle-o'" />
        </div>
        <div class="mask" @click="viewVideoHandle">
          <span v-if="isChecking" class="check-text">审核中</span>
        </div>
      </template>
    </div>

    <!-- 3. 上传触发器 -->
    <VanUploader
      accept="video/*"
      :max-count="1"
      :max-size="50 * 1024 * 1024"
      :after-read="afterRead"
      @oversize="onOversize"
      preview-size="16vw"
      v-if="iShowUpload"
    />
    <DialogVideo ref="dialogVideo" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { showToast } from 'vant';
import { uploadMedia, sleep } from '@/util'
import { useRoute } from 'vue-router'
import DialogVideo from '@/components/dialog-video/index.vue'

const props = defineProps({
  modelValue: { type: String, default: '' } 
});

const emit = defineEmits(['update:modelValue']);

const route = useRoute()
const shopId = +route.params.shopId

const dialogVideo = ref()
const uploadings = ref([])

// 新增：上传进度相关的响应式数据
const progress = ref(0)      // 目标进度数字 (0-100)
const currentRate = ref(0)   // Vant 环形进度条内部动画动画绑定的值

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

/**
 * 获取视频完整元数据
 */
const getVideoMeta = (file) => {
  return new Promise((resolve) => {
    const { name, size, type } = file;
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');

    video.preload = 'metadata';
    video.src = url;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({
        name,
        size,
        sizeFriendly: (size / 1024 / 1024).toFixed(2) + 'MB',
        type,
        duration: Math.floor(video.duration),
        width: video.videoWidth,
        height: video.videoHeight
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ name, size, type, duration: 0 });
    };
  });
};

// 上传处理逻辑
const afterRead = async (file) => {
  uploadings.value.push(file)
  progress.value = 0 // 初始化进度
  currentRate.value = 0

  file.status = 'uploading';
  file.message = '上传中...';

  try {
    const mediaInfo = await getVideoMeta(file.file)
    console.log(mediaInfo, 'mediaInfo')
    // await sleep(5000)
    // throw new Error(123)
    
    // 调用接口，接管 onProgress 钩子
    const res = await uploadMedia({
      file: file.file, 
      shopId, 
      onProgress: (progressData) => {
        // 关键注入：通常云厂商返回的数据里有 percent 属性 (如 0.45 或 45)
        // 请根据你底层实际打包的 uploadMedia 返回数据格式调整。这里兼容小数和整数
        let percent = progressData.percent || 0;
        if (percent < 1) {
          percent = Math.floor(percent * 100);
        } else {
          percent = Math.floor(percent);
        }
        
        // 限制边界值最大为 99，等接口彻底返回完成再变 100 
        progress.value = Math.min(percent, 99);
      }
    })

    const isEffect = uploadings.value.find((item) => item === file)
    if (!isEffect) return
    
    // 上传成功，进度拉满
    progress.value = 100
    file.status = 'done'
    file.message = '上传成功'
    
    emit('update:modelValue', res.data.key)
    
    // 小小延迟 300ms 释放进度条，给用户一个满条反馈的时间，视觉更丝滑
    setTimeout(() => {
      uploadings.value = []
    }, 300)

    console.log(res)

  } catch (error) {
    file.status = 'failed';
    file.message = '上传失败';
    emit('update:modelValue', '')
    uploadings.value = []
    showToast('视频上传失败，请稍后重试');
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

const onOversize = () => {
  showToast('视频不能超过 50MB');
};

const isShowDel = computed(() => {
  if (uploadings.value.length) return true
  if (props.modelValue) return true
  return false
})

const viewVideoHandle = async () => {
  // 精准正则：如果是正在审核的状态，拦截并提示
  if (isChecking.value) {
    showToast('视频审核中～');
    return
  }
  // 正常的视频，正则替换后缀为 .mp4 播放 (顺手帮你把之前要的正则也装在这了！)
  const playableUrl = props.modelValue.replace(/\.check$/, '.mp4')
  dialogVideo.value.show({ url: playableUrl })
}


const isLoading = () => {
  if (uploadings.value.length) return true
  return false
}

defineExpose({isLoading})


</script>

<style lang="scss" scoped>
.com-upload-video {
  :deep(.van-uploader__upload) {
    margin: 0;
  }
  .video-display {
    width: 60px;
    height: 60px;
    position: relative;
    border-radius: 8px; // 保持圆角美观
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
      z-index: 5; // 提高层级防止被遮挡
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

    // 审核中文案设计
    .check-text {
      color: #fff;
      font-size: 10px;
      background: rgba(237, 106, 12, 0.85); // 温暖的审核橙
      padding: 2px 6px;
      border-radius: 10px;
      transform: scale(0.9);
    }
  }

  // 专属上传中蒙版样式
  .uploading-mask {
    background: rgba(0, 0, 0, 0.7) !important; // 稍微调深，凸显进度圈
    
    // 进度条内部文本
    .progress-text {
      color: #ffffff;
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      line-height: 48px; // 撑满圆形，保持居中
    }
  }
}
</style>