<template>
  <div class="com-card" @click="handleClick">
    <div class="company-name">{{ data.name }}</div>
    <div class="content">
      <VanImage fit="contain" :src="getImageUrl(logo)" />
      <div class="desc">{{ data.desc }}</div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/util'

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
  const {id, name} = props.data
  router.push({name: 'product-manage', params: {shopId: id}, query: {title: name}})
}

</script>

<style lang="scss" scoped>
.com-card {
  background: $bgWhite;
  border-radius: $bdrM;
  padding: $pdH $pdM;
  .company-name {
    font-weight: bold;
    font-size: $fsM;
  }
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
    .desc {
      color: $grey;
      font-size: $fsL;
    }
  }
}
</style>