<template>
  <VanDialog
    v-model:show="isShow" show-cancel-button
    :beforeClose="beforeClose" :title="title"
    confirmButtonText="前往开通"
    cancelButtonText="关闭"
  >
    <div class="com-dialog-vip">
      <div class="table-content">
        <div class="list">
          <div class="tit">会员类型</div>
          <div class="list-item">普通用户</div>
          <div class="list-item">300容量会员</div>
          <div class="list-item">600容量会员</div>
          <div class="list-item">1000容量会员</div>
        </div>
        <div class="list list-80">
          <div class="tit">产品容量</div>
          <div class="list-item">50</div>
          <div class="list-item">300</div>
          <div class="list-item">600</div>
          <div class="list-item">1000</div>
        </div>
        <div class="list list-80">
          <div class="tit">图片权限</div>
          <div class="list-item">6张/产品</div>
          <div class="list-item">12张/产品</div>
          <div class="list-item">12张/产品</div>
          <div class="list-item">12张/产品</div>
        </div>
        <div class="list list-80">
          <div class="tit">水印功能</div>
          <div class="list-item">×</div>
          <div class="list-item">√</div>
          <div class="list-item">√</div>
          <div class="list-item">√</div>
        </div>
        <div class="list list-min">
          <div class="tit">价格</div>
          <div class="list-item">免费</div>
          <div class="list-item">¥99/年</div>
          <div class="list-item">¥199/年</div>
          <div class="list-item">¥299/年</div>
        </div>
      </div>
      <div class="desc-content">
        <div>1.不同会员只有容量差异，可补差价升级。</div>
        <div>2.永远都不会打折，随时买都是最低价。</div>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { toVip } from '@/util'
import { useRoute } from 'vue-router'

const props = defineProps({
  title: {type: String, default: '会员权益'}
})

const route = useRoute()
const shopId = + route.params.shopId

const isShow = ref(false)

const show = () => {
  isShow.value = true
}

const beforeClose = (action) => {
  if (action === 'cancel') {
    return true
  }
  setTimeout(() => {
    toVip(shopId)
  }, 0);
  return true
}

defineExpose({show})
</script>

<style lang="scss" scoped>
.com-dialog-vip {
  .table-content {
    display: flex;
    overflow: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    padding-top: 10px;
    .list {
      flex-shrink: 0;
      width: 100px;
      border-right: 1px solid $bgGrey;
      &.list-80{
        width: 80px;
      }
      &.list-min{
        width: 60px;
      }
      .tit {
        text-align: center;
        font-size: 14px;
      }
      .list-item {
        font-size: 12px;
        color: $grey8;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .desc-content {
    font-size: 12px;
    color: $grey8;
    margin: 0 20px;
    border-top: 1px solid $bgGrey;
    padding: 10px 0;
  }

}
</style>