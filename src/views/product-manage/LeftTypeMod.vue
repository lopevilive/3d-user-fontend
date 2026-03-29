<template>
  <div class="view-com-left-type-mod">
    <div class="type-wrap" ref="domWrapRef">
      <div class="type-item"
        v-for="item in productTypes" :key="item.id"
        :class="{'type1-item__active': activeTab === item.id}"
      >
        <div class="type1-content" @click="type1ClickHandle(item.id)">
          <div class="active-line" v-if="activeTab === item.id"></div>
          <div class="txt line2-ell">{{ item.name }}</div>
        </div>
        <div class="type2-list" v-if="subTypesList.length && activeTab === item.id">
          <template  v-for="type2Item of subTypesList" :key="type2Item.id">
            <div class="type2-item"
              :class="{'type2-item__active': subActiveTab === type2Item.id}"
              @click="type2ClickHandle(type2Item.id)"
              v-if="type2Item.id !== 0"
            >
              <div class="line2-ell txt">{{ type2Item.name }}</div>
            </div>
          </template> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import {sleep} from '@/util'

const emits = defineEmits(['type1Change', 'update:activeTab', 'type2Change'])
const props = defineProps({
  productTypes: {type: Array, default: () => []},
  subTypesList: {type: Array, default: () => []},
  activeTab: {type: Number},
  subActiveTab: {type: Number}
})

const domWrapRef = ref()

const type1ClickHandle = (id) => {
  emits('update:activeTab', id)
  emits('type1Change')
}

const type2ClickHandle = (id) => {
  emits('type2Change', id)
}


const handlePos = async () => {
  if (!domWrapRef.value) return
  const dom = domWrapRef.value.querySelector('.type1-item__active')
  if (!dom) return
  dom.scrollIntoView({
    // behavior: 'smooth', // 平滑滚动
    // block: 'nearest',   // 垂直方向尽可能靠近视口
    // inline: 'start'     // 水平方向对齐到左侧
  });
}

onActivated(() => {
  handlePos()
})


</script>

<style lang="scss" scoped>
.view-com-left-type-mod {
  // 一级分类项
  .type-item {
    overflow: hidden; // 确保子元素圆角生效
    transition: background-color 0.2s ease-in-out; // 背景色过渡

    &:hover {
      background-color: rgba($themeColor, 0.05); // 保留悬停背景
    }

    .type1-content {
      padding: 10px 0; // 恢复原始内边距
      box-sizing: border-box;
      position: relative;
      width: 100%;
      cursor: pointer; // 手型光标

      .txt {
        width: 100%;
        color: $grey7; // 恢复原始颜色
        font-size: 14px; // 恢复原始字体大小
        padding: 0 10px; // 恢复原始内边距
        box-sizing: border-box;
        transition: color 0.2s ease-in-out, font-weight 0.2s ease-in-out;
      }
    }
    // 激活状态的左侧指示线
    .active-line {
      position: absolute;
      height: 50%; // 恢复原始高度
      border-left: 4px solid $themeColor; // 恢复原始粗细
      top: 50%;
      left: 0; // 恢复原始位置
      transform: translate(0, -50%);
    }
  }

  // 一级分类激活状态
  .type1-item__active {

    .type1-content {
      .txt {
        font-weight: bold; // 恢复原始加粗
        color: #000; // 深色文字
      }
    }
  }
  
  // 二级分类列表容器
  .type2-list {
    background-color: $bgGrey3; // 恢复原始背景色

    .type2-item {
      padding: 8px; // 恢复原始内边距
      padding-left: 15px; // 恢复原始左侧内边距
      color: $grey6; // 恢复原始文字颜色
      cursor: pointer; // 手型光标
      transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      .txt {
        font-size: 13px; // 恢复原始二级分类字体大小
      }
    }

    // 二级分类激活状态
    .type2-item__active {
      color: $themeColor; // 主题色
      font-weight: bold; // 恢复原始加粗
      background-color: rgba($themeColor, 0.1); // 保留激活背景
      padding-left: 12px; // 调整内边距以配合边框

      &:hover {
        background-color: rgba($themeColor, 0.15); // 保留激活状态悬停背景
      }
    }
  }
}
</style>
