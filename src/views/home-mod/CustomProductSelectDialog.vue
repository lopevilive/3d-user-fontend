<template>
  <VanDialog
    :title="`选择产品 (已选 ${selectedProducts.length}/${maxProducts})`"
    v-model:show="isShow" show-cancel-button :beforeClose="beforeClose"
  >
    <div class="view-com-custom-product-select-dialog">
      <form action="none" class="search-form" @submit.prevent="searchBlurHadle">
        <VanSearch
          v-model="searchStr"
          placeholder="请输入产品名称"
          @blur="searchBlurHadle"
          @cancel="searchBlurHadle"
          show-action
        />
      </form>
      
      <div class="product-list" ref="productListRef" @scroll="handleScroll">
        <VanCheckboxGroup v-model="selectedProducts">
          <div class="product-item" v-for="product in products" :key="product.id">
            <VanCheckbox
              :name="product.id"
              :disabled="selectedProducts.length >= maxProducts && !selectedProducts.includes(product.id)"
              @click.stop
            />
            <div class="product-content" @click="toggleProduct(product.id)">
              <ProductLineDisplay :product="product" />
            </div>
          </div>
        </VanCheckboxGroup>
        <div v-if="isLoading" class="loading"><VanLoading /></div>
        <div v-if="finished" class="done">到底啦～</div>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant';
import { getProduct } from '@/http'
import ProductLineDisplay from '@/components/product-line-display/index.vue'

const route = useRoute()
const shopId = +route.params.shopId

const isShow = ref(false)
const searchStr = ref('')
const selectedProducts = ref([])
const products = ref([])
const currPage = ref(0)
const finished = ref(false)
const isLoading = ref(false)
const prevSearch = ref('');
let maxProducts = 10

const searchBlurHadle = () => {
  const currentSearch = searchStr.value;
  
  if (prevSearch.value === currentSearch) return;
  
  if (currentSearch === '') {
    products.value = [];
    currPage.value = 0;
    finished.value = false;
    fetchProducts();
    prevSearch.value = '';
    return;
  }
  
  products.value = [];
  currPage.value = 0;
  finished.value = false;
  fetchProducts();
  prevSearch.value = currentSearch;
};

const toggleProduct = (productId) => {
  if (selectedProducts.value.length >= maxProducts && !selectedProducts.value.includes(productId)) {
    showToast(`最多只能选择${maxProducts}个产品`)
    return
  }
  
  const index = selectedProducts.value.indexOf(productId)
  if (index === -1) {
    selectedProducts.value.push(productId)
  } else {
    selectedProducts.value.splice(index, 1)
  }
}

let resolve = null
let reject = null
const beforeClose = async (action) => {
  if (action === 'cancel') {
    reject(null)
    return true
  }
  if (selectedProducts.value.length === 0) {
    showToast('请至少选择一个产品')
    return false
  }
  
  if (selectedProducts.value.length > maxProducts) {
    showToast(`最多只能选择${maxProducts}个产品`)
    return false
  }
  
  const selected = products.value.filter(p => 
    selectedProducts.value.includes(p.id)
  )
  resolve(JSON.parse(JSON.stringify(selected)))
  return true
}

const fetchProducts = async (loadMore = false) => {
  try {
    if (isLoading.value || finished.value) return;
    if (!loadMore && products.value.length > 0) return;
    
    isLoading.value = true;
    const payload = {
      shopId,
      pageSize: 10,
      status: 0,
      currPage: currPage.value,
      productType: '0',
      searchStr: searchStr.value || ''
    };
    
    const { data } = await getProduct(payload)
    if (loadMore) {
      products.value = [...products.value, ...data.list]
    } else {
      products.value = data.list
    }
    currPage.value++
    finished.value = data.finished
    isLoading.value = false
  } catch (error) {
    console.error('获取产品列表失败:', error)
    showToast('获取产品列表失败')
  }
}

const productListRef = ref(null)

const handleScroll = () => {
  if (!productListRef.value || isLoading.value || finished.value) return
  
  const { scrollTop, scrollHeight, clientHeight } = productListRef.value
  const threshold = 50
  
  if (scrollHeight - (scrollTop + clientHeight) < threshold) {
    fetchProducts(true)
  }
}

const show = async (existingProductIds = [], maxCount) => {
  maxProducts = maxCount || 10
  searchStr.value = ''
  selectedProducts.value = [...existingProductIds]
  prevSearch.value = ''
  if (products.value.length === 0) {
    currPage.value = 0
    finished.value = false
    await fetchProducts()
  }
  isShow.value = true
  return new Promise((a, b) => {
    resolve = a
    reject = b
  })
}


defineExpose({ show })
</script>

<style lang="scss" scoped>
.view-com-custom-product-select-dialog {
  padding: 16px;
  
  .product-list {
    margin-top: 12px;
    height: 300px;
    overflow: auto;
    
    .product-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
      
      .van-checkbox {
        margin-right: 12px;
        flex-shrink: 0;
      }
      
      .product-content {
        flex: 1;
        cursor: pointer;
        overflow: hidden;
      }
    }
  }
}

.loading {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.done {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #969799;
  font-size: 12px;
  padding: 10px 0;
}
</style>