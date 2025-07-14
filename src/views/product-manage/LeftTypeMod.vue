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
  .type-item {
    .type1-content {
      padding: 10px 0;
      box-sizing: border-box;
      position: relative;
      width: 100%;
      .txt {
        width: 100%;
        color: $grey7;
        font-size: 14px;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    .active-line {
      position: absolute;
      height: 50%;
      border-left: 4px solid $themeColor;
      top:50%;
      left: 0;
      transform: translate(0, -50%);
    }
  }
  .type1-item__active {
    .type1-content {
      .txt {
        font-weight: bold;
        color: #000;
      }
    }
    
  }
  .type2-list {
    background: $bgGrey3;
    .type2-item {
      padding: 8px;
      padding-left: 15px;
      color: $grey6;
      .txt {
        font-size: 13px;
      }
    }
    .type2-item__active {
      color: $themeColor;
      font-weight: bold;
    }
  }
}

</style>
