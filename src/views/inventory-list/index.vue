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
          <div class="top-bar__right">
            <VanButton class="mul-share" :disabled="disabled" @click="mulShare" size="small" icon="share-o" type="primary" plain>批量转发</VanButton>
            <VanButton @click="clearAllHandle" size="small" icon="delete-o" type="danger" plain>清空清单</VanButton>
          </div>
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
              <VanButton
                v-if="isShowEditPrice" class="edit-price" text="修改" size="mini" type="primary" icon="edit"
                @click="editPriceHandle(item)"
              />
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
            <span style="flex-shrink: 0;">合计：</span>
            <span class="price">¥{{ totalPrice }}</span>
          </div>
          <div class="bottom-count"> <span class="unit">数量：</span>{{ totalCount }}</div>
        </div>
        <div class="right-content">
          <VanButton type="success" :text="canBuild ? '生成购物清单' : '未选必选品'" @click="toBuildInventory" :disabled="disabled"/>
        </div>
      </div>
    </div>
    <div v-else class="no-data-wrap">
      <VanEmpty description="暂无产品" />
      <VanButton text="返回" block @click="goBack"/>
    </div>
    <ProductPriceDialog ref="priceDialogRef" :noSpecs="true" title="修改价格" />
    <RecordFloat />
  </div>
</template>

<script setup>
import { useInventoryList } from './hook'
import CountControls from '@/components/add-controls/CountControls.vue'
import Address from '@/components/address/index.vue'
import ProductPriceDialog from '@/components/product-price-dialog/index.vue'
import RecordFloat from './RecordFloat.vue'

const {
  shopCarList, handleUpdateCount, deleteItem, clearAllHandle, remark, getIsCheck, checkClickHandle,
  init, isCheckedAll, checkedAllHandle, totalCount, totalPrice, toBuildInventory, disabled, mulShare,
  priceDialogRef, isShowEditPrice, editPriceHandle, goBack, canBuild
} = useInventoryList()

init()

</script>


<style lang="scss" scoped>
$imgSize: 60px;

.view-invetory-list {
  .no-data-wrap {
    padding: 0 12px;
  }
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
    .mul-share {
      margin-right: 10px;
    }
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
          flex-shrink: 0;
        }
        .tit-wrap {
          width: 100%; 
          overflow: hidden;
        }
        .price-wrap {
          display: flex;
          align-items: center;
          margin: 5px 0;
          .edit-price {
            margin-left: 10px;
            flex-shrink: 0;
          }
          .price {
            color: $red;
            word-break: break-all;
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
    display: flex;
    .price {
      color: $red;
      word-break: break-all;
    }
  }
  .bottom-count {
    .unit {
      font-weight: bold;
    }
  }
  .right-content {
    flex-shrink: 0;
  }
}

</style>
