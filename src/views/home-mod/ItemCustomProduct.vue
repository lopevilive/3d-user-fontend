<template>
  <div class="view-com-item-custom-product">
    <ItemWrap title="热门产品模块" @delete="$emit('delete')">
      <div class="content">
        <TransitionGroup name="list" tag="div" class="prod-list">
          <div class="item" v-for="(item, index) in data.list" :key="item.id">
            <div class="item-left">
              <div class="count">{{ index + 1 }}.</div>
              <ProductLineDisplay :product="item" />
            </div>
            <div class="item-right">
              <VanIcon name="down" class="move-top move" v-if="index !== 0" @click="moveUp(index)" />
              <VanIcon name="down" class="move" v-if="index !== data.list.length - 1" @click="moveDown(index)" />
              <VanIcon name="delete-o" class="del" @click="deleteHandle(index)" />
            </div>
          </div>
        </TransitionGroup>
        <div class="bottom-wrap">
          <VanButton
            text="新增一项"
            icon="plus"
            size="small"
            :disabled="data.list.length >= MAX_PRODUCTS"
            @click="addHandle"
          />
        </div>
      </div>
    </ItemWrap>
  </div>
  <CustomProductSelectDialog ref="customProductSelectDialogRef" />
</template>

<script setup>
import ItemWrap from './ItemWrap.vue'
import { useItemCustomProduct } from './itemCustomProductHook'
import CustomProductSelectDialog from './CustomProductSelectDialog.vue'
import ProductLineDisplay from '@/components/product-line-display/index.vue'

const emits = defineEmits(['delete', 'update:config'])
const props = defineProps({
  config: {
    type: Object,
    default: () => ({})
  }
})

const {
  data, addHandle, moveUp, moveDown, deleteHandle, customProductSelectDialogRef, MAX_PRODUCTS
} = useItemCustomProduct(props, emits)

</script>

<style lang="scss" scoped>
.view-com-item-custom-product {
  .content {
    .prod-list {
      .item {
        display: flex;
        align-items: center;
        border-bottom: 1px solid $bgGrey;
        padding: 10px 0;
        .item-left {
          display: flex;
          align-items: center;
          width: 72%;
          flex-shrink: 0;
          .count {
            margin-right: 10px;
            flex-shrink: 0;
          }
        }
        .item-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex: 1;
          .move-top {
            transform: rotate(180deg);
          }
          .move {
            color: $btnText;
          }
          .del {
            color: $red;
          }
          .van-icon {
            font-size: 20px;
            padding: 5px 2px;
            font-weight: bold;
            margin:  0 2px;
          }
        }
      }
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
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
