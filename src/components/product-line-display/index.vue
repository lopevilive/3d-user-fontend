<template>
  <div class="com-product-line-display">
    <VanImage :src="getImageUrl(product.url.split(',')[0])" />
    <div class="product-info">
      <div class="name ellipsis">{{ product.desc }}</div>
      <div class="price">
        <span class="unit">¥</span>
        <span class="num">{{ getPriceDisplay(product) || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getImageUrl, getSpecPrices } from '@/util';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

const getPriceDisplay = (product) => {
  const { price, isSpec, specDetials } = product;
  if (isSpec === 0) return price;
  const data = JSON.parse(specDetials || '{}');
  let list = [];
  if (isSpec === 1) list = data.singleSpecs || [];
  if (isSpec === 2) list = data.mulSpecPriceList || [];
  const { min, max } = getSpecPrices(list);
  if (min === '') return '';
  if (min === max) return `${max}`;
  return `${min} ~ ${max}`;
};
</script>

<style lang="scss" scoped>
.com-product-line-display {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  width: 100%;
  overflow: hidden;

  .van-image {
    width: 40px;
    height: 40px;
    border-radius: $bdrM;
    overflow: hidden;
    flex-shrink: 0;
  }

  .product-info {
    margin-left: 12px;
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;

    .name {
      font-size: 14px;
      margin-bottom: 4px;
      width: 100%;
    }

    .price {
      color: $themeColor;
      font-size: 16px;
    }
  }
}
</style>