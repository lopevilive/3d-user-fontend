<template>
  <VanFloatingBubble
    class="com-home-edit-float"
    axis="xy"
    magnetic="x"
    :gap="gap"
    v-model:offset="offset"
    @click="clickHandle"
  >
    <div class="content">
      <VanIcon name="ellipsis"/>
    </div>
  </VanFloatingBubble>
  <ActionsSheet
    :actions="actions"
    ref="actionsSheetRef"
    close-on-click-action
    cancel-text="取消"
    @select="actionHandle"
  />
</template>

<script setup>
import { ref } from 'vue'
import { getFlexW, toContactSys } from '@/util'
import { useRoute, useRouter } from 'vue-router'
import ActionsSheet from '@/components/actions-sheet/index.vue'

const route = useRoute()
const router = useRouter()

const shopId = + route.params.shopId

const gap = getFlexW(24)
const offset = ref({ x: getFlexW(375 - 24 - 30), y: window.innerHeight * 0.7});


const actionsSheetRef = ref()
const clickHandle = async () => {
  actionsSheetRef.value.show()
}

const acCreateAlbum = () => {
  router.push({name: 'album-mod'})
}

const actions = [
  [
    {name: '创建画册', color: '#64b486', action: acCreateAlbum},
    {name: '联系客服', color: '#5794f7', action: toContactSys}
  ]
]

const actionHandle = (ac) => {
  const {action} = ac
  if (action) action()
}





</script>

<style lang="scss">
.com-home-edit-float {
  width: 30px;
  height: 30px;
  opacity: .8;
  .content {
    font-weight: bold;
    font-size: 20px;
  }
}
</style>