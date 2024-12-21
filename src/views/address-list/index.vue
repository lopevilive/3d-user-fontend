<template>
  <div class="view-address-list">
    <VanAddressList
      @add="onAdd"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onAdd = () => {
  router.push({name: 'address-edit'})
}

</script>

<style lang="scss" scoped>

</style>