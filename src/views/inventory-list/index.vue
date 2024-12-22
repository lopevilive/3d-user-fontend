<template>
  <div class="view-invetory-list">
    <div class=content v-if="shopCarList?.length">
      <div class="address">
        <Address />
      </div>
      <div class="remark">
        <VanField
          v-model="remark"
          placeholder="请输入备注（选填）"
          type="textarea"
          :maxlength="250"
          :rows="2"
          :clearable="true"
        />
      </div>
      <VanSticky>
        <div class="top-bar">
          <VanCheckbox
            :model-value="isCheckedAll"
            @click="checkedAllHandle"
          >全选</VanCheckbox>
          <VanButton @click="clearAllHandle" size="small" icon="delete-o" type="danger" plain>清空清单</VanButton>
        </div>
      </VanSticky>
      <div class="list-content">
        <div class="list-item" v-for="item in shopCarList">
          <div class="select">
            <VanCheckbox
              :model-value="getIsCheck(item)"
              shape="square"
              @click="checkClickHandle(item)"
              />
          </div>
          <div class="img"><VanImage :src="item.url" fit="cover"/></div>
          <div class="main">
            <div class="tit-wrap ellipsis"> {{ item.desc }} </div>
            <div class="price-wrap">
              <span class="main-label">单价：</span>
              <span v-if="item.price" class="price">¥{{ item.price }}</span>
              <span v-else> - </span>
            </div>
            <div class="spec-wrap" v-if="item.spec">
              <span class="main-label">规格：</span>
              <VanTag type="primary" plain> {{ item.spec }}</VanTag>
            </div>
            <div class="num-wrap">
              <span class="main-label">数量：</span>
              <CountControls :mode="1" :count="item.count" @update:count="(val) => {
                handleUpdateCount(item, val)
              }" />
            </div>
          </div>
          <div class="delete">
            <VanIcon name="delete-o" @click="deleteItem(item)"/>
          </div>
        </div>
      </div>
      <div class="bottom-content">
        <div class="left-content">
          <div class="bottom-price">
            <span>合计：</span>
            <span class="price">¥{{ totalPrice }}</span>
          </div>
          <div class="bottom-count"> <span class="unit">数量：</span>{{ totalCount }}</div>
        </div>
        <div class="right-content">
          <VanButton type="success" text="生成报价单" @click="toBuildInventory" :disabled="disabled"/>
        </div>
      </div>
    </div>
    <div v-else>
      <VanEmpty description="暂无清单" />
    </div>
  </div>
</template>

<script setup>
import { useInventoryList } from './hook'
import CountControls from '@/components/add-controls/CountControls.vue'
import Address from '@/components/address/index.vue'

const {
  shopCarList,
  handleUpdateCount,
  deleteItem,
  clearAllHandle,
  remark,
  getIsCheck,
  checkClickHandle,
  init,
  isCheckedAll,
  checkedAllHandle,
  totalCount,
  totalPrice,
  toBuildInventory,
  disabled
} = useInventoryList()

init()

</script>


<style lang="scss" scoped>
$imgSize: 60px;

.view-invetory-list {
  .content {
    padding-bottom: $footerBarH;
    .remark {
      margin-top: 1px;
      margin-bottom: 5px;
    }
  }
  .top-bar {
    padding: 10px $pdH;
    background: $bgWhite;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
  }
  .list-content {
    margin-top: 1px;
    .list-item {
      display: flex;
      background: $bgWhite;
      margin-bottom: 1px;
      padding: 10px 0;
      .select {
        display: flex;
        align-items: center;
        padding: 0 10px;
        flex-shrink: 0;
        height: $imgSize;
      }
      .img {
        width: $imgSize;
        height: $imgSize;
        border-radius: 5px;
        overflow: hidden;
        flex-shrink: 0;
        :deep(.van-image) {
          width: 100%;
          height: 100%;
        }
      }
      .main {
        flex: 1;
        flex-shrink: 0;
        min-width: 0;
        padding: 0 10px;
        .main-label {
          color: $grey7;
        }
        .tit-wrap {
          width: 100%; 
          overflow: hidden;
        }
        .price-wrap {
          .price {
            color: $red;
          }
        }
        .num-wrap {
          display: flex;
          padding: 5px 0;
          .com-count-controls {
            width: 110px;
          }
        }
      }
      .delete {
        height: $imgSize;
        display: flex;
        align-items: center;
        padding-right: 10px;
        color: $red;
        font-size: 20px;
        .van-icon {
          padding: 5px;
        }
      }
    }
  }
}
.bottom-content {
  height: $footerBarH;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: $bgWhite;
  box-sizing: border-box;
  border-top: 1px solid $bgGrey;
  padding: 10px $pdH;
  display: flex;
  justify-content: space-between;
  .bottom-price {
    font-size: 16px;
    font-weight: bold;
    .price {
      color: $red;
    }
  }
  .bottom-count {
    .unit {
      font-weight: bold;
    }
  }
}

</style>
