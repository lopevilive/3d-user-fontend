<template>
  <div class="com-address-edit">
    <VanForm>
      <VanField label="收货人" placeholder="收货人" v-model="name" />
      <VanField label="电话" placeholder="电话（选填）" v-model="tel" />
      <VanField label="地址" placeholder="收获地址（选填）" v-model="addressDetail" />
      <VanCell title="设为默认地址">
        <template #value>
          <VanSwitch v-model="isDefault"/>
        </template>
      </VanCell>
    </VanForm>
    <div class="footer-wrap">
      <VanButton text="保存" type="primary" round block @click="saveHandle"/>
      <VanButton text="删除" round block v-if="showDelete" @click="delHandle"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showFailToast } from 'vant'

const props = defineProps({
  addressInfo: {type: Object, default: () => {}},
  showDelete: {type: Boolean, default: false}
})

const emits = defineEmits(['save', 'delete'])

const name = ref(props.addressInfo.name || '')
const tel = ref(props.addressInfo.tel || '')
const addressDetail = ref(props.addressInfo.addressDetail || '')

const isDefault = ref(!!props.addressInfo.isDefault)


const saveHandle = () => {
  name.value = name.value.trim()
  if (!name.value) {
    showFailToast('请输入收货人～')
    return
  }
  const payload = {
    ...props.addressInfo,
    name: name.value,
    tel: tel.value,
    addressDetail: addressDetail.value,
    isDefault: isDefault.value
  }
  emits('save', payload)
}

const delHandle = () => {
  emits('delete', props.addressInfo)
}

</script>

<style lang="scss" scoped>
.com-address-edit {
  padding: $pdM;
  padding-bottom: 50px;
  .footer-wrap {
    .van-button {
      margin-top: 10px;
    }
  }
}

</style>
