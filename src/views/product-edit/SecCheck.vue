<!-- 调接口审核内容 -->
<template>
  <VanOverlay :show="isShow" :z-index="1000">
    <VanLoading class="view-com-sec-check" >
      <div class="text">内容审核中～</div>
    </VanLoading>
  </VanOverlay>
</template>

<script setup>
import { ref } from 'vue'
import { sleep } from '@/util'
import { textImgCheck } from '@/http'
import { useRoute } from 'vue-router'

const route = useRoute()
const shopId = +route.params.shopId

const isShow = ref(false)


const check = async (payload) => {
  const {attr, desc, descUrl, url} = payload
  const strList = [attr, desc]
  const urlList = []
  let tmp = []
  if (descUrl) {
    tmp = descUrl.split(',')
  }
  if (url) {
    tmp = [...tmp, url.split(',')]
  }
  for (const item of tmp) {
    const matchRet = /ap-guangzhou.myqcloud.com\/(.*)/.exec(item)
    const name = matchRet && matchRet[1]
    urlList.push(name)
  }
  try {
    isShow.value = true
    await textImgCheck({shopId, strList, urlList})
    return true
  } catch(e) {
    return false
  } finally {
    isShow.value = false
  }
}

defineExpose({check})

</script>

<style scoped lang="scss">
.view-com-sec-check {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  .text {
    color: #fff;
  }
}

</style>