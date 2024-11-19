<template>
  <div class="view-home" v-if="!loading">
    <div style="height: 1px;"></div>
    <div class="header mrM" v-if="!userAlbum">
      <span class="text">我也想做一本云画册？</span>
      <VanButton class="btn" size="small" @click="toAlbum">立即创建</VanButton>
    </div>
    <div v-else>
      <h3 class="mrM">我的图册</h3>
      <Card class="mrM" v-for="item in userAlbum" :data="item" />
    </div>
    <template v-if="viewLogList.length">
      <h3 class="mrM">最近浏览</h3>
      <Card class="mrM" v-for="item in viewLogList" :data="item" />
    </template>
    <!-- <h3 class="mrM">推荐图册</h3>
    <Card class="mrM" v-for="item in recommendList" :data="item" /> -->
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import Card from '@/components/card/index.vue'
import {getShop} from '@/http'
import { commonFetch, globalLoading, viewLog} from '@/util'
import { globalData } from '@/store'

const router = useRouter()

const loading = globalLoading.getRef()

const toAlbum = () => {
  router.push({name: 'album-mod'})
}

const userAlbum = ref(null)
// 用户的图册
const getUserAlbum = async () => {
  const {userInfo: {userId} } = globalData.value
  if (!userId) return
  const data = await commonFetch(getShop, {userId})
  if (data?.length) {
    userAlbum.value = data
  }
}

// 获取最近浏览
const viewLogList = ref([])
const getViewLog = async () => {
  const idList = viewLog.getlog()
  if (!idList.length) return
  viewLogList.value = await commonFetch(getShop, {shopId: idList})
}

// 推荐图册列表
const recommendList = ref([])
const getRecommendList = async () => {
  recommendList.value = await commonFetch(getShop)
}


const init = () => {
  getUserAlbum()
  getViewLog()
  // getRecommendList()
}

init()
  
</script>

<style scoped lang="scss">
.view-home {
  .text {
    font-size: $fsH;
    color: #000;
  }
  .header {
    background: $bgWhite;
    border-radius: $bdrH;
    display: flex;
    padding: 40px 0;
    align-items: center;
    flex-direction: column;
    box-shadow: $shadow;
    .btn {
      margin-top: $mrL;
    }
  }
}
</style>


