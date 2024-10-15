<template>
  <div class="view-album-mod">
    <VanForm label-align="right" label-width="70" ref="formRef">
      <VanCellGroup>
        <VanField label="Logo:" :required="true" :rules="[{required: true, message: 'logo 不能为空'}]">
          <template #input>
            <UploadImgs v-model="data.logo"/>
          </template>
        </VanField>
        <VanField
          v-model="data.name"
          label="名称:"
          :required="true"
          placeholder="请输入名称"
          :rules="[{required: true, message: '名称不能为空'}]"
        />
        <VanField
          v-model="data.desc"
          label="业务介绍:"
          :required="true" 
          placeholder="请输入介绍"
          :rules="[{required: true, message: '业务介绍不能为空'}]"
        />
      </VanCellGroup>
      <div style="margin: 16px;">
        <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
      </div>
    </VanForm>
  </div>
</template>


<script setup>
import { shopMod, getShop } from '@/http'
import { commonFetch } from '@/util'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UploadImgs from '@/components/uploadImgs/index.vue'
import { globalData } from '@/store'

const router = useRouter()
const route = useRoute()
const {id} = route.params

const formRef = ref()

const data = ref({
  id: id ? +id : 0, // 0 新建
  name: '',
  desc: '',
  logo: '',
})

const saveHandle = async () => {
  await formRef.value.validate()
  const { userId } = globalData.value
  const payload = {...data.value, userId}
  const res =  await commonFetch(shopMod, payload, '保存成功')
  router.replace({name: 'product-manage', params: {shopId: res}})
  setTimeout(() => {
    if (window.history.state.back === window.history.state.current) router.go(-1)
  }, 0);
}

const init = async () => {
  if (!id) return
  const res = await commonFetch(getShop, {shopId: id})
  if (res?.length) data.value = res[0]
}

init()


  
</script>

<style scoped lang="scss">
.view-album-mod {
  background: $bgWhite;
  :deep(.van-cell-group) {
    border-bottom: 1px solid #ebedf0;
    border-radius: 0;
  }

}
</style>


