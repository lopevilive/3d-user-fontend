<template>
  <div class="view-home-mod">
    <div class="cfg-list-list">
      <div class="cfg-item">
        <ItemBanner />
      </div>
      <div class="cfg-item">
        <ItemProductType />
      </div>
      <div class="cfg-item">
        <ItemCustomProduct />
      </div>
    </div>
    <div class="bottom-wrap">
      <div class="bottom-left">
        <div class="label-txt">是否启用</div> <VanSwitch />
      </div>
      <div class="bottom-right">
        <VanButton text="预览" size="small" />
        <VanButton text="保存配置" type="primary" size="small" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ItemBanner from './ItemBanner.vue';
import ItemProductType from './ItemProductType.vue'
import ItemCustomProduct from './ItemCustomProduct.vue'


</script>

<style lang="scss" scoped>
.view-home-mod {
  padding-bottom: $footerBarH;
  .cfg-list-list {
    padding: $pdL;
    .cfg-item:not(:first-child) {
      margin-top: 10px;
    }
  }
  .bottom-wrap {
    height: $footerBarH;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 $pdH;
    box-sizing: border-box;
    background: $bgWhite;
    border-top: 1px solid $bgGrey;
    .bottom-left {
      display: flex;
      align-items: center;
      width: 40%;
      .label-txt {
        margin-right: 5px;
      }
    }
    .bottom-right {
      display: flex;
      justify-content:flex-end;
      width: 60%;
      .van-button {
        margin-left: 15px;
      }
    }
  }
}

</style>