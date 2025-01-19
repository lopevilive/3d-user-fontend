<template>
  <VanDialog title="请输入密码" v-model:show="isShow" show-cancel-button :beforeClose="beforeClose">
    <VanField placeholder="请输入" input-align="center" v-model="passStr"/>
  </VanDialog>
</template>

<script setup>
import { ref } from 'vue'
import { showFailToast } from 'vant'
import { valiEncryCode } from '@/http'
import { commonFetch } from '@/util'
import { globalData } from '@/store'

let shopId = null

let resolve = null
let reject = null

const isShow = ref(false)

const passStr = ref('')

class LocalManage {
  constructor() {
    this.key = 'encryData'
  }
  getData() {
    let ret = localStorage.getItem(this.key)
    if (!ret) ret = '{}'
    return JSON.parse(ret)
  }
  setData(data) {
    let d = JSON.stringify(data)
    localStorage.setItem(this.key, d)
  }
}

const localManage = new LocalManage()


const handleVali = async () => {
  const ret = await commonFetch(valiEncryCode, {shopId, passStr: passStr.value})
  if (ret === false) {
    showFailToast('密码错误~')
  }
  if (ret === true) {
    globalData.value.encryInfo[shopId] = true
    const localData = localManage.getData()
    localData[shopId] = passStr.value
    localManage.setData(localData)
  }
  resolve(ret)
}

const beforeClose = async (action) => {
  if (action === 'cancel') {
    resolve(false)
    return true
  }
  passStr.value = passStr.value.trim()
  if (!passStr.value) {
    showFailToast('请输入密码')
    return false
  }
  handleVali()
  return true
}

const preHandle = async () => {
  const data = localManage.getData()
  if (!data[shopId]) return false
  const ret = await commonFetch(valiEncryCode, {shopId, passStr: data[shopId]})
  if (ret === true){
    globalData.value.encryInfo[shopId] = true
    return true
  } 
  delete data[shopId]
  localManage.setData(data)
  return false
}


const show = async (id) => {
  shopId = id
  let pass = await preHandle()
  if (pass === true) return true
  isShow.value = true
  const p = new Promise((a,b) => {
    resolve = a
    reject = b
  })
  return p
}

defineExpose({show})

</script>
