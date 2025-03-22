<template>
  <div class="view-com-inventory-item" @click="clickHandle">
    <div class="order-wrap">
      <div class="left">
        <span>清单号：</span>
        <span>{{data.orderId}}</span>
        <VanTag type="primary" v-if="data.status === 0">待处理</VanTag>
        <VanTag type="success" v-if="data.status === 1">已完成</VanTag>
        <VanTag color="#6e7071" v-if="data.status === 2">已取消</VanTag>
      </div>
      <div class="right">
        <VanButton text="复制" size="mini" @click="copyStr(data.orderId)" />
      </div>
    </div>
    <div class="block-info-wrap">
      <span class="label">收货信息：</span>
      <span class="content">{{ info.address || '无' }}</span>
    </div>
    <div class="block-info-wrap" v-if="info.remark">
      <span class="label">备注：</span>
      <span class="content">{{ info.remark }}</span>
    </div>
    <div class="block-info-wrap" >
      <span class="label">清单价格：</span>
      <span class="content">共 {{ info.totalCount }} 件商品，合计：<span class="price">¥{{ info.totalPrice || '-' }}</span></span>
    </div>
    <div class="order-bottom">
      <div class="time">{{ dayjs(data.add_time * 1000).format('YYYY/MM/DD HH:mm') }}</div>
      <div class="btn-wrap">
        <VanButton v-if="[0,1].includes(data.status)" text="取消清单" size="small" @click="cancelHandle" type="default"/>
        <VanButton v-if="[0,2].includes(data.status)" text="完成清单" size="small" @click="finishHandle" type="success"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { copyStr } from '@/util'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const props = defineProps({
  data: {type: Object, default: () => {}}
})

const emits = defineEmits(['cancel', 'finish'])

const router = useRouter()

const info = computed(() => {
  return JSON.parse(props.data.data)
})

const cancelHandle = () => {
  emits('cancel', props.data.id)
}

const finishHandle = () => {
  emits('finish', props.data.id)
}

const clickHandle = (e) => {
  if (e.target.type === 'button') return
  router.push({name: 'view-inventory', params: {id: props.data.id}})
}

</script>

<style scoped lang="scss">
.view-com-inventory-item {
  background: $bgWhite;
  padding:  $pdM;
  margin-top: 10px;
  .order-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $bgGrey;
    padding-bottom: $pdL;
    font-size: 12px;
    .left {
      color: $grey8;
      .van-tag {
        margin-left: 10px;
      }
    }
  }
  .block-info-wrap {
    display: flex;
    justify-content: space-between;
    color: $grey8;
    margin: 5px 0;
    .label {
      flex-shrink: 0;
      width: 80px;
      text-align: right;
    }
    .content {
      flex: 1;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      .price {
        color: $red;
      }
    }
  }
  .order-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid $bgGrey;
    padding-top: 5px;
    .time {
      font-size: 12px;
      color: $grey8;
    }
    .btn-wrap {
      .van-button {
        margin-left: 10px;
      }
    }
  }
}
</style>