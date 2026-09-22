<template>

</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import { decodeScene, getImageUrl } from '@/util'
import { globalData } from '@/store'

const route = useRoute()
const router = useRouter()

const data = decodeScene(route.query.scene)

const toDetial = async () => {
  globalData.value.isShowSke = true
  try {
    router.replace({name: 'product-manage', params: {shopId: data.shopId}, query: { toDetial: data.id}})
  } catch(e) {
    console.error(e)
  } finally {
    globalData.value.isShowSke = false
  }
}

const toList = async () => {
  router.replace({name: 'product-manage', params: {shopId: data.shopId}})
}


const init = () => {
  if (data.name === 'view-inventory') {
    router.replace({name: data.name, params: {shopId: data.shopId, id: data.id}})
  }
  if (data.name === 'product-detial') {
    toDetial()
  }
  if (data.name === 'product-manage') {
    toList()
  }
  if (data.name === 'mul-manage') {
    router.replace({name: data.name, params: {shopId: data.shopId, id: data.id}})
  }
}

init()


</script>

