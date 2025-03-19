<template>
  <div class="view-address-list">
    <VanAddressList
      @add="onAdd"
      @edit="onEdit"
      :list="displayList"
      default-tag-text="默认"
      v-model="chosenAddressId"
    />
    <VanEmpty v-if="displayList.length === 0" description="请新增地址" />
  </div>
  <VanActionSheet
      v-model:show="showAction"
    >
    <VanAddressEdit
      :areaList="areaList"
      show-set-default
      @save="onSave"
      @delete="onDelete"
      :address-info="currData"
      :show-delete="isShowDel"
      :tel-validator="() => true"
    />
  </VanActionSheet>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { globalData } from '@/store'
import { areaList } from '@vant/area-data';
import { addressMod, addressDel } from '@/http'
import { commonFetch } from '@/util'

const router = useRouter()
const showAction = ref(false)

const currData = ref({})

const isShowDel = computed(() => {
  return !!currData.value.id
})

const onAdd = () => {
  currData.value = {id: 0}
  showAction.value = true
}

const onEdit = (data) => {
  currData.value = {...data}
  showAction.value = true
}

const onSave = async (data) => {
  delete data.country
  delete data.address
  showAction.value = false
  await commonFetch(addressMod, data)
  globalData.value._addressList.done = false
}

const onDelete = async (data) => {
  showAction.value = false
  await commonFetch(addressDel, {id: data.id})
  globalData.value._addressList.done = false
}

const displayList = computed(() => {
  let res = globalData.value.addressList.map((item) => {
    let ret = {...item}
    ret.address = ret.addressDetail
    return ret
  })
  res = res.sort((a, b) =>{
    if (globalData.value.selectedAddress.includes(a.id)) return -1
    return 0
  })

  return res
})

const chosenAddressId = computed({
  get(){
    return globalData.value.selectedAddress
  },
  set(list){
    let newVal = []
    for (const item of list) {
      if (globalData.value.selectedAddress.includes(item)) continue
      newVal.push(item)
    }
    globalData.value.selectedAddress = newVal
    router.go(-1)
  }
})

</script>

<style lang="scss" scoped>

</style>