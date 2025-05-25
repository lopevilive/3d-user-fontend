<template>
  <div class="view-com-dialog-sort-wrap" v-if="isShow">
    <div class="content">
      <div class="title">调整顺序</div>
      <div class="list-wrap">
        <Container lock-axis="y" orientation="vertical" @drop="onDrop">
          <Draggable v-for="(item, index) in data" class="drag-item">
            <div class="list-item">
              <div class="type-name">{{ item.name }}</div>
              <div class="type-opt">
                <VanIcon name="down" class="icon-up" v-if="index!==0" @click="upHandle(index)" />
                <VanIcon name="down" v-if="index!==(data.length-1)" @click="downHandle(index)" />
              </div>
            </div>
          </Draggable>
        </Container>
      </div>
      <div class="tips">(注：可拖动调整顺序～)</div>
      <div class="button-wrap">
        <VanButton text="取消" size="large" @click="cancelHandle" />
        <VanButton text="保存" size="large" class="save-btn" @click="saveHandle"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Container, Draggable } from "vue3-smooth-dnd";
import { modProdTypesSort } from '@/http'
import { commonFetch, productTypesManage } from '@/util'
import { globalData } from '@/store'

const route = useRoute()
const shopId = + route.params.shopId

const isShow = ref(false)

const data = ref([])

const show = (list) => {
  isShow.value = true
  data.value = list
}

const cancelHandle = () => {
  isShow.value = false
}

const onDrop = (params) => {
  const {removedIndex, addedIndex} = params
  if (removedIndex === undefined || addedIndex === undefined) return
  if (removedIndex === addedIndex) return
  const list = data.value
  if (removedIndex > addedIndex) {
    const removeItem = list[removedIndex]
    list.splice(addedIndex, 0, removeItem)
    list.splice(removedIndex + 1, 1)
  } else {
    const removeItem = list[removedIndex]
    list.splice(addedIndex + 1, 0, removeItem)
    list.splice(removedIndex, 1)
  }
  data.value = list
}

const upHandle = (idx) => {
  onDrop({removedIndex: idx, addedIndex: idx - 1})
}

const downHandle= (idx) => {
  onDrop({removedIndex: idx, addedIndex: idx + 1})
}

const saveHandle = async () => {
  try {
    await commonFetch(modProdTypesSort, {shopId, list: data.value}, '保存成功～')
  } finally {
    isShow.value = false
    globalData.value._productTypes[shopId].done = false
    productTypesManage.dirty(shopId)
  }
}

watch(() => isShow.value, (val) => {
  if (val) {
    document.body.className = 'van-overflow-hidden'
  } else {
    document.body.className = ''
  }
})

onBeforeUnmount(() => {
  document.body.className = ''
})

defineExpose({show})


</script>

<style lang="scss" scoped>
.view-com-dialog-sort-wrap {
  position: fixed;
  z-index: 101;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
  left: 0;
  top: 0;
  .content {
    .title {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      line-height: 50px;
      margin-top: 10px;
    }
    .tips {
      font-size: 12px;
      text-align: center;
      color: $grey9;
      line-height: 30px;
    }
    width: 320px;
    background: $bgWhite;
    margin: 0 auto;
    margin-top: 100px;
    overflow: auto;
    border-radius: 20px;
    .list-wrap {
      height: 250px;
      overflow: auto;
      .drag-item:first-child{
        .type-opt {
          justify-content: end;
        }
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 20px;
        box-sizing: border-box;
        border-bottom: 1px solid $bgGrey;
      }
      .type-opt {
        display: flex;
        width: 60px;
        justify-content: space-between;
        .van-icon {
          color: #3d8bf2;
          font-size: 18px;
          padding: 3px 5px;
        }
        .icon-up {
          transform: rotate(180deg);
        }
      }
    }
    .button-wrap {
      display: flex;
      border-top: 1px solid $bgGrey;
      .van-button {
        border: none;
      }
      .save-btn {
        border-left: 1px solid $bgGrey;
        :deep(.van-button__text) {
          color: #3d8bf2;
        }
      }
    }
  }
}

</style>