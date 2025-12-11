<template>
  <VanPopup
    position="top" :style="{ height: '65%' }" v-model:show="isShow" :close-on-click-overlay="false"
    @click-overlay="overlayHandle"
  >
    <div class="view-com-filter-specs">
      <div class="list">
        <div class="item" v-for="(item, idx) in mulSpecs">
          <div class="item__tit">{{ item.name }}</div>
          <div class="child_list">
            <div
              class="child__item" v-for="childItem in item.list"
              :class="{'child__active': isActive(childItem, idx)}"
              @click="handleClick(childItem, idx)"
            >{{ childItem.name }}</div>
          </div>
        </div>
      </div>
      <div class="content__bottom">
        <VanButton text="重置" size="small" @click="resetHandle" />
        <VanButton text="确认" size="small" type="primary" @click="saveHandle" />
      </div>
    </div>
  </VanPopup>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  mulSpecs: {type: Array, default: () => []}
})

const isShow = ref(false)
const selectedIds = ref([])

const isActive = ({id}, idx) => {
  const list = selectedIds.value[idx]
  if (list.includes(id)) return true
  return false
}

const getDefaultList = () => {
  let ret = new Array(props.mulSpecs.length).fill(0)
  return ret.map(() => [])
}

let resolve
let reject
const getData = async (arr) => {
  selectedIds.value = arr?.length ? arr : getDefaultList()
  isShow.value = true
  const p = new Promise((a, b) => {
    resolve = a
    reject = b
  })
  return p
}

const overlayHandle = () => {
  isShow.value = false
  reject()
}

const handleClick = (data, index) => {
  const list = selectedIds.value[index]
  const idx = list.findIndex((item) => item === data.id)
  if (idx === -1) {
    list.push(data.id)
  } else {
    list.splice(idx, 1)
  }
}

const saveHandle = () => {
  resolve(JSON.parse(JSON.stringify(selectedIds.value)))
  isShow.value = false
}

const resetHandle = () => {
  selectedIds.value = getDefaultList()
  saveHandle()
}



defineExpose({getData})



</script>

<style scoped lang="scss">
.view-com-filter-specs {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    padding: $pdM;
    .item {
      padding-bottom: 20px;
      border-bottom: 1px solid $bgGrey;
      margin-top: 10px;
      .item__tit {
        font-weight: bold;
      }
      .child_list {
        display: flex;
        flex-wrap: wrap;
        .child__item {
          margin-top: 10px;
          background: $bgGrey;
          padding: 5px 10px;
          margin-right: 12px;
          border-radius: 3px;
          &.child__active {
            background: $themeColor;
            color: #fff;
          }
        }
      }
    }
  }
  .content__bottom {
    height: 50px;
    flex-shrink: 0;
    border-top: 2px solid $bgGrey;
    box-sizing: border-box;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 0 $pdM;
    .van-button {
      margin-left: 12px;
    }
  }
}
</style>