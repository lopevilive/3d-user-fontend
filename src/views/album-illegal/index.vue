<template>
  <div class="view-album-illegal">
    <VanEmpty description="你似乎来到了没有内容存在的荒原～" />
    <VanButton type="primary" block text="回到首页" @click="goHome"/>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.replace({name: 'home'})
}
</script>

<style lang="scss" scoped>
.view-album-illegal {
  padding: 0 $pdH;
}

</style>