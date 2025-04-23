<template>
  <div class="view-banner-cfg">
    <div class="img-wrap">
      <div class="no-img" v-if="!data.url">
        暂无内容~
      </div>
      <ImgSwipe v-else :list="imgList" :scale="data.scale" :mode="2" :autoplay="3000"/>
    </div>
    <VanField >
      <template #label>
        <FormLabel label="轮播内容" tips="支持拖动调整图片顺序"/>
        ({{imgList.length || 0}}/{{ maxCount }})
      </template>
      <template #input>
        <UploadImgs ref="uploadImgsRef" :maxCount="maxCount" v-model="data.url" />
      </template>
    </VanField>
    <VanField label="内容高度" readonly is-link @click="isShowScale = true" v-model="scaleDisplay" />
    <Select v-model="data.scale" :columns="columns" v-model:show="isShowScale" />
    <div class="bottom">
      <VanButton block type="primary" native-type="submit" @click="saveHandle">保存</VanButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UploadImgs from '@/components/uploadImgs/index.vue'
import FormLabel from '@/components/form-label/index.vue'
import Select from '@/components/select/index.vue'
import { shopInfoManage, commonFetch } from '@/util'
import ImgSwipe from '@/components/img-swipe/index.vue'
import { showToast } from 'vant'
import { modShopStatus } from '@/http'

const route = useRoute()
const router = useRouter()

const shopId = + route.params.shopId

const data = ref({ url: '', scale: '0.33'})

const maxCount = 5
const uploadImgsRef = ref()
const isShowScale = ref(false)


const columns = [
  {text: '4:1', value: '0.25'},
  {text: '3:1', value: '0.33'},
  {text: '2:1', value: '0.5'},
  {text: '1:1', value: '1'}
]

const imgList = computed(() => {
  if (!data.value.url) return []
  return data.value.url.split(',')
})

const scaleDisplay = computed(() => {
  for (const item of columns) {
    if (item.value === data.value.scale) return item.text
  }
  return ''
})


const saveHandle = async () => {
  if (imgList.value.length === 0) return showToast('请上传图片～')
  const payload = {shopId}
  payload.bannerCfg = JSON.stringify(data.value)
  await commonFetch(modShopStatus, payload)
  shopInfoManage.dirty(shopId)
  router.go(-1)
}

const init = async () => {
  let info = await shopInfoManage.getData(shopId)
  info = info[0]
  data.value = JSON.parse(info.bannerCfg)
  console.log(data.value)
}

init()

</script>

<style lang="scss" scoped>
.view-banner-cfg {
  .img-wrap {
    .no-img {
      height: 100px;
      text-align: center;
      line-height: 100px;
      background: $bgWhite;
      color: $grey8;
      margin-bottom: 1px;
    }
  }
  .bottom {
    height: $footerBarH;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    padding: 0 $pdH;
    padding-top: 8px;
    box-sizing: border-box;
    background: $bgWhite;
  }
}

</style>


