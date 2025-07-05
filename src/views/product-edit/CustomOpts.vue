<template>
  <VanDialog
    teleport="body"
    v-model:show="isShow"
    show-cancel-button
    confirmButtonText="保存"
    cancelButtonText="取消"
    :beforeClose="beforeClose"
  >
    <div class="viewcom-custom-opts">
      <div class="list">
        <div class="attr-item" v-for="item in customOpts">
          <span>{{item}}</span>
          <VanIcon name="cross" @click="delHandle(item)"/>
        </div>
        <div class="add">
          <div class="before" v-if="status === 1" @click="addHandle">
            <VanIcon name="plus"/>
            新增
          </div>
          <div v-if="status === 2" class="after">
            <VanField
              ref="vanFieldRef"
              placeholder="请输入"
              input-align="center"
              v-model="val"
              @blur="blurHandle"
              :maxlength="8"
            />
          </div>
        </div>
      </div>
    </div>
  </VanDialog>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { valiIllegalStr } from '@/util'
import { showToast } from 'vant'

const emits =  defineEmits(['update'])

const isShow = ref(false)
const customOpts = ref([])
const status = ref(1)
const val = ref('')
const vanFieldRef = ref()
const rawData = ref({})

const show = (data) => {
  init()
  rawData.value = data
  let tmp = data?.customOpts || []
  customOpts.value = [...tmp]
  isShow.value = true
}

const addHandle = () => {
  status.value = 2
  setTimeout(() => {
    vanFieldRef.value.focus()
  }, 200);
}

const init = () => {
  val.value = ''
  status.value = 1
}

const blurHandle = () => {
  let str = val.value?.trim?.()
  if (!str) {
    init()
    return
  }
  customOpts.value = [...new Set([...customOpts.value, str])]
  init()
}

const delHandle = (str) => {
  customOpts.value = customOpts.value.filter((item) => item !== str)
}

const beforeClose = async (action) => {
  if (action === 'cancel') return true
  vanFieldRef?.value?.blur()
  await nextTick()
  for (const str of customOpts.value) {
    const ret = valiIllegalStr(str)
    if (ret) {
      showToast(`不能包含【${ret}】等敏感词。`)
      return false
    }
  }
  emits('update', {data: rawData.value, list: customOpts.value})
  return true
}

defineExpose({show})

</script>

<style lang="scss">
$bgCol: #ddeff5;
.viewcom-custom-opts {
  height: 120px;
  overflow: auto;
  box-sizing: border-box;
  padding: $pdM $pdH;
  .list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .attr-item {
    flex-shrink: 0;
    background: $bgGrey2;
    padding: 5px 10px;
    padding-right: 0;
    margin-right: 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .van-icon {
      // padding: 6px 8px;
      padding: 3px 10px;
      font-size: 18px;
    }
  }
  .add {
    flex-shrink: 0;
    margin-bottom: 10px;
    .before {
      background: $bgCol;
      color: #7ebfe3;
      padding: 5px 10px;
      border-radius: 5px;
    }
    .after {
      background: $bgCol;
      padding: 5px 10px;
      border-radius: 5px;
      .van-field {
        padding: 0;
        width: 60px;
        background: $bgCol;
      }
    }
  }
}

</style>