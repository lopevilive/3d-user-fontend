<template>
  <VanField
    class="view-com-price-mod"
    label="产品价格"
    :rules="[{validator: valiPrice}]"
  >
    <template #input>
      <div class="content">
        <div class="content__head">
          <div class="left__inp">
            <VanField v-if="!checked" v-model="priceDisplay" placeholder="请输入价格" class="pd0" :border="false"/>
          </div>
          <span class="line">|</span>
          <VanCheckbox v-model="checked" shape="square" >多规格</VanCheckbox>
        </div>
        <div class="content__spec" v-if="checked">
          <div class="spec-item" v-for="(item, index) in specsDisplay">
            <VanField
              :maxlength="6"
              v-model="item.name"
              @update:model-value="inputHandle"
              class="pd0 name"
              :border="false"
              placeholder="规格名称" 
            />
            <VanField
              :maxlength="8"
              v-model="item.price"
              @update:model-value="inputHandle"
              class="pd0"
              :border="false"
              placeholder="规格价格"
            />
            <VanIcon name="back-top" class="move" v-if="isShowMove(index)" @click="moveHandle(index)"/>
            <VanIcon name="delete-o" class="del" v-if="isShowDel" @click="delHandle(index)" />
          </div>
          <VanButton :disabled="disabledAdd" size="mini" type="primary" icon="plus" @click="addSpec" >新增规格</VanButton>
        </div>
      </div>
    </template>
  </VanField>
</template>

<script setup>
import { ref, computed } from 'vue'
import { priceReg } from '@/util'

const props = defineProps({
  price: {type: String},
  isSpec: {type: Number},
  specs: {type: String}
})

const emits = defineEmits(['update:price', 'update:isSpec', 'update:specs'])

const checked = computed({
  get() {
    return props.isSpec === 1
  },
  set(val) {
    emits('update:isSpec', val ? 1 : 0)
  }
})


const priceDisplay = computed({
  get() {
    return props.price
  },
  set(val) {
    emits('update:price', val)
  }
})

const specsDisplay = computed({
  get() {
    let list = props?.specs || '[]'
    list = JSON.parse(list)
    if (list.length === 0) {
      if (props.price) {
        list.push({name: '默认', price: props.price})
      } else {
        list.push({name: '', price: ''})
      }
      list.push({name: '', price: ''})
    }
    return list
  }
})

const inputHandle = () => {
  const list = [...specsDisplay.value]
  emits('update:specs', JSON.stringify(list))
}

const addSpec = () => {
  const list = [...specsDisplay.value]
  list.push({name: '', price: ''})
  emits('update:specs', JSON.stringify(list))
}

const valiPrice = () => {
  // 分两种情况：单规格和多规格
  if (props.isSpec === 1) { // 多规格
    const list = [...specsDisplay.value]
    let ret = []
    let idx = 0
    for (const item of list) {
      idx += 1
      let {price, name} = item
      price = price?.trim() || ''
      name = name?.trim() || ''
      if (!name && !price) continue
      if (price) {
        if (!priceReg.test(price)) return `第 ${idx} 个规格价格有误`
        if (!name) return `第 ${idx} 个规格请输入名称`
        ret.push(item)
      }
    }
    if (ret.length < 2) return '请至少填写 2 个规格'
  } else { // 单规格
    const price = props.price || ''
    if (!price) return true
    if (!priceReg.test(price)) return '请输入正确价格'
  }
}

const disabledAdd = computed(() => {
  if (specsDisplay.value.length >= 6) return true
  return false
})

const isShowMove = (index) => {
  if (index === 0) return false
  return true
}

const moveHandle = (index) => {
  const list = [...specsDisplay.value]
  const pre = index -1
  let tmp = list[pre]
  list[pre] = list[index]
  list[index] = tmp
  emits('update:specs', JSON.stringify(list))
}

const isShowDel = computed(() => {
  if (specsDisplay.value?.length > 2) return true
  return false
})

const delHandle = (index) => {
  const list = [...specsDisplay.value]
  list.splice(index, 1)
  emits('update:specs', JSON.stringify(list))
}

</script>


<style lang="scss" scoped>
.view-com-price-mod {
  .content {
    width: 100%;
    .content__head {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .left__inp {
        flex: 1;
        display: flex;
      }
      .line {
        margin-right: 10px;
        color: $greyPlaceholder;
      }
    }
    .content__spec {
      padding-top: 5px;
      .spec-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $bgGrey2;
        padding-bottom: 5px;
        margin-bottom: 5px;
        align-items: center;
        .name {
          width: 40%;
          flex-shrink: 0;
        }
        :deep(.van-icon) {
          font-size: 18px;
        }
        .move {
          color: #5794f7;
          padding: 0 4px;
          margin-left: 4px;
        }
        .del {
          color: $red;
          margin-left: 5px;
        }
      }
    }
    
  }
}

</style>