<template>
  <VanField class="view-com-inner-params" :border="false" :rules="[{validator: validSync}]">
    <template #label>
      <FormLabel label="内部备注" tips="可见范围可在隐私设置中调整">
        <template #default>
          <div class="admin-tag">
            <template v-if="allowInnerParamsDealer">
              当前<span class="role">管理员</span>、<span class="role">分销员</span>可见，客户无法查看，可在「隐私设置 - 内部参数权限」中修改。
            </template>
            <template v-else>
              当前仅<span class="role">管理员</span>可见，<span class="role">分销员</span>与客户无法查看，可在「隐私设置 - 内部参数权限」中修改。
            </template>
          </div>
        </template>
      </FormLabel>
    </template>

    <template #input>
      <div class="inner-params-content">
        <TransitionGroup name="list" tag="div" class="list-container">
          <div 
            v-for="(item, index) in innerList" 
            :key="item._id" 
            class="param-row"
          >
            <div class="delete-action-left">
              <VanIcon 
                name="delete-o" 
                class="delete-icon" 
                @click="removeParam(index)" 
              />
            </div>

            <div class="field-group">
              <VanField
                v-model="item.key"
                placeholder="参数名"
                class="inner-field key-field"
                :border="false"
                @update:modelValue="triggerSync"
                :maxlength="10"
              />
              <div class="split-line"></div>
              <VanField
                v-model="item.value"
                placeholder="值"
                class="inner-field value-field"
                :border="false"
                @update:modelValue="triggerSync"
                :maxlength="16"
              />
            </div>

            <div class="sort-actions-right">
              <VanIcon 
                name="down" 
                class="sort-icon up"
                @click="moveRow(index, -1)"
                v-if="index !== 0"
              />
              <VanIcon 
                name="down" 
                class="sort-icon down"
                @click="moveRow(index, 1)" 
                v-if="index !== innerList.length - 1"
              />
            </div>
          </div>
        </TransitionGroup>

        <div class="add-btn-wrap" @click="addParam">
          <VanIcon name="plus" />
          <span>添加内部参数</span>
        </div>
      </div>
    </template>
  </VanField>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { shopInfoManage } from '@/util';

const props = defineProps({
  modelValue: { type: String, default: '' }
});

const route = useRoute()
const shopId = +route.params.shopId

const shopInfo = ref({})

// 内部参数可见范围：innerParamsType 1-管理员 + 分销员；0（默认）- 仅管理员
const allowInnerParamsDealer = computed(() => shopInfo.value?.innerParamsType === 1)

const initShopInfo = async () => {
  if (!shopId) return
  try {
    const ret = await shopInfoManage.getData(shopId)
    shopInfo.value = ret?.[0] || {}
  } catch (e) {
    console.error(e)
  }
}

onMounted(initShopInfo)

const emits = defineEmits(['update:modelValue', 'resetValidation']);

// Computed 模式：后端存储 _id
const innerList = computed({
  get() {
    try {
      return props.modelValue ? JSON.parse(props.modelValue) : [];
    } catch (e) {
      return [];
    }
  },
  set(newVal) {
    emits('update:modelValue', JSON.stringify(newVal));
    emits('resetValidation')
  }
});

const triggerSync = () => {
  innerList.value = [...innerList.value];
};

const addParam = () => {
  const newList = [...innerList.value, { 
    key: '', value: '',
    _id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` 
  }];
  innerList.value = newList;
};

const removeParam = (index) => {
  const newList = [...innerList.value];
  newList.splice(index, 1);
  innerList.value = newList;
};

const moveRow = (index, direction) => {
  const newList = [...innerList.value];
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= newList.length) return;
  
  [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
  innerList.value = newList;
};

const validSync = () => {
  const list = innerList.value;
  
  for (let i = 0; i < list.length; i++) {
    // 预先处理掉首尾空格
    const k = (list[i].key || '').trim();
    const v = (list[i].value || '').trim();
    
    // 如果两个都为空（全空格也算空），跳过这一行（或者是允许全空行存在但不保存）
    if (!k && !v) continue;

    // 校验：有一边填了，另一边没填
    if (k && !v) {
      return `第 ${i + 1} 项缺失“值”`;
    }
    if (!k && v) {
      return `第 ${i + 1} 项缺失“参数名”`;
    }
  }

  return true;
};

</script>

<style scoped lang="scss">
.view-com-inner-params {
  padding-top: 15px;
  padding-bottom: 15px;

  .list-move {
    transition: transform 0.4s cubic-bezier(0.55, 0, 0.1, 1);
  }
  
  .list-enter-active, .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from, .list-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  .list-leave-active {
    position: absolute;
    width: 100%; 
  }

  :deep(.van-cell) {
    padding: 0;
    background: transparent;
  }

  .inner-params-content {
    width: 100%;
    position: relative;

    .param-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      background: #fff;

      /* 左侧删除按钮 */
      .delete-action-left {
        margin-right: 5px;
        flex-shrink: 0;
        display: flex;
        align-items: center;

        .delete-icon {
          font-size: 18px;
          color: $themeColor; /* 沿用你代码里的变量 */
          padding: 5px 0;
          cursor: pointer;
          font-weight: bold;
        }
      }

      .field-group {
        flex: 1;
        display: flex;
        align-items: center;
        background: #f7f8fa; 
        border-radius: 6px;
        border: 1px solid #ebedf0;

        .inner-field {
          flex: 1;
          :deep(.van-field__control) {
            font-size: 13px;
            padding: 8px 10px;
          }
        }
        .key-field { flex: 4; }
        .value-field { flex: 6; }
        .split-line { width: 1px; height: 16px; background: #dcdee0; }
      }

      /* 右侧排序按钮样式 */
      .sort-actions-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 5px;
        flex-shrink: 0;
        width: 24px; 

        .sort-icon {
          font-size: 16px;
          color: $btnText; 
          cursor: pointer;
          font-weight: bold;
          padding: 2px;
          &.up {
            transform: rotate(180deg);
          }
        }
      }
    }

    .add-btn-wrap {
      display: inline-flex;
      align-items: center;
      font-size: 13px;
      color: $btnText;
      /* 这里的 28px = 删除图标宽度18px + margin-right 10px */
      margin-left: 28px; 
      cursor: pointer;
      span { margin-left: 5px; }
    }
  }
}
.admin-tag {
  padding: 20px 10px;
  color: $grey7;
  font-size: $fsM;
  line-height: 1.6;

  .role {
    color: $themeColor;
    font-weight: bold;
  }
}
</style>