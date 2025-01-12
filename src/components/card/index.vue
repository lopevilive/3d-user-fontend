<template>
  <div>
    <div v-if="isShowIllegal" class="com-card">
      <div class="com-card"> 很抱歉，目前我们暂时无法支持您的业务需求。希望您能理解。</div>
    </div>
    <div v-if="isShow" class="com-card" @click="handleClick">
      <div class="content">
        <VanImage fit="cover" :src="getImageUrl(logo)" />
        <div class="txt-content">
          <div class="tit">
            <span class="text">{{ data.name }}</span>
            <VanTag v-if="isOwner" type="primary">我的画册</VanTag>
            <VanTag v-if="isAdmin" type="success">管理员</VanTag>
          </div>
          <div class="desc">{{ data.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/util'
import { globalData } from '@/store'

const props = defineProps({
  data: {type: Object, default: () => {}}
})

const router = useRouter()

const logo = computed(() => {
  const {url} = props.data
  if (!url) return ''
  return props.data.url.split(',')[0]
})

const handleClick = () => {
  const {id, name, url} = props.data
  router.push({ name: 'product-manage', params: {shopId: id}, query: {
    title: name,
    imageUrl: getImageUrl(url?.split?.(',')?.[0] || '')
  }})
}

const isOwner = computed(() => {
  const {ownerList = []} = globalData.value?.userInfo
  if (ownerList.includes(props.data.id)) return true
  return false
})

const isAdmin = computed(() => {
  const {adminList = []} = globalData.value?.userInfo
  if (adminList.includes(props.data.id)) return true
  return false
})

const isShow = computed(() => {
  if (props.data.status === 1) return false
  return true
})

const isShowIllegal = computed(() => {
  if (props.data.status !== 1) return false
  if (globalData.value.rid === 99) return true
  const { ownerList } = globalData.value.userInfo
  if (ownerList?.length) {
    if (ownerList.includes(props.data.id)) return true
  }
  return false
})

</script>

<style lang="scss" scoped>
.com-card {
  background: $bgWhite;
  border-radius: $bdrM;
  padding: $pdM;
  .content {
    display: flex;
    margin-top: $mrL;
    :deep(.van-image){
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      border-radius: $bdrM;
      overflow: hidden;
      margin-right: $mrL;
    }
    .txt-content {
      flex: 1;
      .tit {
        .text {
          font-weight: bold;
          font-size: $fsM;
          margin-right: 5px;
        }
      }
    }
    .desc {
      color: $grey8;
      font-size: $fsL;
      margin-top: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      line-clamp: 3;
    }
  }
}
</style>