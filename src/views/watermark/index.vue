<template>
  <div class="view-watermark">
    <div class="img-wrap">
      <VanImage
        class="preview-img"
        :src="getImageUrl(watermarkCfg.previewUrl)"
        fit="contain"
        @click="handlePreview"
      />
    </div>
    <div class="bottom-ctrl">
      <div class="list-wrap">
        <div class="ctrl-list">
          <div class="item text"  @click="modText" v-if="watermarkCfg.type===2">
            <div class="name">水印内容</div>
            <div class="desc ellipsis">{{ watermarkCfg.text }}</div>
          </div>
          <div class="item" v-if="watermarkCfg.type===1" @click="modImage">
            <div class="name">图片水印</div>
            <div class="desc img-watermark">
              <div v-if="!watermarkCfg.image">点击上传</div>
              <VanImage v-else :src="getImageUrl(watermarkCfg.image)"/>
            </div>
          </div>
          <div class="item" @click="modPos">
            <div class="name">水印位置</div>
            <div class="desc">{{ posDisplay }}</div>
          </div>
          <div class="item" @click="modSize">
            <div class="name">水印大小</div>
            <div class="desc">{{ watermarkCfg.fontsize }}</div>
          </div>
          <div class="item" @click="modColor" v-if="watermarkCfg.type===2">
            <div class="name">水印颜色</div>
            <div class="desc desc-flex">
              <span class="color" :style="`background-color: ${watermarkCfg.fill}`"></span>
            </div>
          </div>
          <div class="item" @click="modDegree" v-if="watermarkCfg.type===2">
            <div class="name">水印角度</div>
            <div class="desc">{{ watermarkCfg.degree }}°</div>
          </div>
          <div class="item" @click="modDissolve">
            <div class="name">水印透明度</div>
            <div class="desc">{{ watermarkCfg.dissolve }}</div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <VanButton block type="primary" native-type="submit" @click="saveHandle">保存水印设置</VanButton>
      </div>
    </div>
    <DialogModText ref="dialogModTextRef"/>
    <PosSelect ref="posSelectRef"/>
    <DialogSize ref="dialogSizeRef" />
    <DialogColor ref="dialogColorRef" />
    <FloatCfg
      @changeImg="changeImgHandle"
      @img="switchToImg"
      @text="switchToText"
    />
    <div class="replace-img">
      <UploadImgs ref="replaceImgRef" :noWatermark="1" @update:modelValue="handleReplaceImg" @start="startReplaceHandle" />
    </div>
    <div class="replace-img">
      <UploadImgs ref="waterImgRef" :noWatermark="1" @update:modelValue="handleWaterImg" @start="startReplaceHandle" />
    </div>
  </div>
</template>

<script setup>
import {getImageUrl} from '@/util'
import { useWaterMark } from './hook'
import DialogModText from './DialogModText.vue'
import PosSelect from './PosSelect.vue'
import DialogSize from './DialogSize.vue'
import DialogColor from './DialogColor.vue'
import FloatCfg from './FloatCfg.vue'
import UploadImgs from '@/components/uploadImgs/index.vue'

const {
  init, watermarkCfg, modText, dialogModTextRef, posDisplay,
  posSelectRef, modPos, modSize, dialogSizeRef, modDegree, modDissolve,
  dialogColorRef, modColor, saveHandle, handlePreview, changeImgHandle,
  replaceImgRef, handleReplaceImg, startReplaceHandle, switchToImg, waterImgRef,
  handleWaterImg, modImage, switchToText
} = useWaterMark()

init()


</script>

<style lang="scss" scoped>
$bottomHeight: 150px;

.view-watermark {
  position: relative;
  padding-bottom: $bottomHeight;
  height: 100%;
  box-sizing: border-box;
  .img-wrap {
    // height: calc(100% - $bottomHeight);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: baseline;
    .preview-img {
      width: 100%;
      height: 100%;
      :deep(.van-image__loading-icon) {
        font-size: 100px;
        margin-top: 60px;
      }
      :deep(img) {
        max-height: 100%;
        min-width: 200px;
      }
    }
  }
  
  .bottom-ctrl {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $bottomHeight;
    border-top: 1px solid #e3e3e3;
    box-sizing: border-box;
    background: $bgWhite;
    .list-wrap {
      width: 100%;
      overflow: auto;
      box-sizing: border-box;
    }
    .ctrl-list {
      display: flex;
      flex-wrap: nowrap;
      width: auto;
      .item {
        width: 100px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 8px;
        box-sizing: border-box;
        flex-direction: column;
        border-right: 1px solid $bgGrey;
        &.text {
          width: 120px;
        }
        .color {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        .name {
          margin-bottom: 5px;
          color: #5794f7;
        }
        .desc {
          width: 100%;
          font-size: 12px;
          color: $grey8;
          text-align: center;
          height: 24px;
          line-height: 24px;
          &.desc-flex {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &.img-watermark {
            :deep(.van-image) {
              height: 100%;
            }
          }
        }
      }
    }
    .btn-wrap {
      padding: 0 10px;
      margin-top: 12px;

    }
  }
  .replace-img {
    position: fixed;
    left: -99999px;
  }
}

</style>