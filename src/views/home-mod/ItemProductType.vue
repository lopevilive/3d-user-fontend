<template>
  <div class="view-com-item-product-type">
    <ItemWrap title="产品分类模块" @delete="$emit('delete')">
      <div class="content">
        <TransitionGroup name="list" tag="div" class="item-list">
          <div class="item" v-for="(item, index) in data.list" :key="item.typeId">
            <div class="item-left">
              <VanField label="1.分类名称" :border="false" class="type-name">
                <template #input>
                  <div class="ellipsis">{{ getTypeName(item.typeId) }}</div>
                </template>
              </VanField>
              <VanField label="分类 logo" :border="false">
                <template #input>
                  <UploadImgs  v-model="item.url" />
                </template>
              </VanField>
            </div>
            <div class="item-right">
              <!-- 上移：非第一个显示 -->
              <VanIcon
                name="down"
                class="move-top move"
                v-show="index !== 0"
                @click="moveUp(index)"
              />
              <!-- 下移：非最后一个显示 -->
              <VanIcon
                name="down"
                class="move"
                v-show="index !== data.list.length - 1"
                @click="moveDown(index)"
              />
              <!-- 删除按钮：绑定删除事件并传递当前索引 -->
              <VanIcon
                name="delete-o"
                class="del"
                @click="deleteHandle(index)"
              />
            </div>
          </div>
        </TransitionGroup>
        <div class="bottom-wrap">
          <VanButton text="新增一项" icon="plus" size="small" @click="addHandle" />
        </div>
      </div>
    </ItemWrap>
    <ProductTypeSelectDialog ref="productTypeSelectDialogRef" />
  </div>
</template>

<script setup>
import ItemWrap from './ItemWrap.vue'
import { useItemProductType } from './itemProductTypeHook'
import UploadImgs from '@/components/uploadImgs/index.vue'
import ProductTypeSelectDialog from './ProductTypeSelectDialog.vue'

defineEmits(['delete'])

const {
  data, addHandle, productTypeSelectDialogRef, getTypeName, moveUp, moveDown, deleteHandle
} = useItemProductType()
</script>

<style lang="scss" scoped>
.view-com-item-product-type {
  .content {
    :deep(.van-cell) {
      padding-left: 0;
      padding-right: 0;
    }
    .item-list {
      .item:not(:first-child) {
        margin-top: 10px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid $grey9;
        box-sizing: border-box;
        padding: $pdL;
        border-radius: $bdrH;
        .item-left {
          width: 80%;
          flex-shrink: 0;
          border-right: 1px solid $bgGrey;
          .type-name {
            border-bottom: 1px solid $bgGrey;
            flex-shrink: 0;
            flex-wrap: nowrap;
            .ellipsis {
              width: 70%;
              flex-shrink: 0;
            }
          }
          :deep(.com-upload-imgs) {
            height: 60px;
          }
        }
        .item-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          .van-icon {
            font-size: 20px;
            padding: 5px 5px;
            font-weight: bold;
            cursor: pointer; /* 新增：鼠标悬浮手型，提升交互体验 */
          }
          .move {
            color: $btnText;
          }
          .del {
            color: $red;
          }
          .move-top {
            transform: rotate(180deg);
          }
          .van-icon:not(:first-child) {
            margin-top: 5px;
          }
        }
      }
    }
    .bottom-wrap {
      margin-top: 10px;
    }
  }
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}
</style>