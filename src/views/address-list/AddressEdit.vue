<template>
  <div class="view-address-edit">
    <VanAddressEdit
      :areaList="areaList"
      show-set-default
      @save="onSave"
    />
  </div>
</template>

<script setup>
import { areaList } from '@vant/area-data';
import { addressMod } from '@/http'
import { commonFetch } from '@/util'

const onSave = async (data) => {
  await commonFetch(addressMod, data)
}


</script>