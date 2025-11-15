import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { vipInfoManage, shopInfoManage, toVip } from '@/util'
import { globalData } from '@/store'
import dayjs from 'dayjs'


export const useExpiredTipsHook = () => {
  const route = useRoute()

  const shopId = +route.params.shopId

  const localKey = 'vip_expired_tips'
  const vipInfo = ref()
  const isShow = ref(false)
  const nowTs = Math.floor(Date.now() / 1000)

  let status = 0 // 0-无需提示、1-需要提示过期、3-已过期
  const remainD = 10 // 多少天内过期需要提示
  const expiredD = 30 // 过期多少天后，不再提示

  const valiExpired = async () => {
    const { expiredTime } = vipInfo.value
    if (nowTs >= expiredTime) { // 已过期
      const range = nowTs - expiredTime
      const d = Math.floor(range / 60 / 60 / 24)
      if (d > expiredD) { // 过期超过指定天数后不再提示
        status = 0
      } else {
        status = 3
      }
      return
    }
    const remain = expiredTime - nowTs
    const d = Math.floor(remain / 60 / 60 / 24)
    if (d < remainD) { // 小于指定时间，需要提示
      status = 1
    }
  }
  
  const valiLocalStorage = async () => { // 检查是否已经提示过了
    if (status === 0) return
    let localData = localStorage.getItem(localKey) || '{}'
    localData = JSON.parse(localData)
    const nowTs = Math.floor(Date.now() / 1000)
    if (!localData[shopId]) {
      localData[shopId] = {lastTs: 0}
    }
    const matchItem = localData[shopId]
    const {lastTs} = matchItem
    
    const range = nowTs - lastTs
    if (range > 60 * 60 * 24) { // 超过一天没提示
      matchItem.lastTs = nowTs
      localStorage.setItem(localKey, JSON.stringify(localData))
    } else {
      status = 0
    }
  }
  
  const displayTips = computed(() => {
    const { expiredTime } = vipInfo.value
    if (status === 1) {
      const remain = expiredTime - nowTs
      const d = Math.ceil(remain / 60 / 60 / 24)
      return `会员 ${d} 天后过期！`
    }
    if (status === 3) {
      const str = dayjs(expiredTime * 1000).format('YYYY/MM/DD')
      return `会员已到期 (${str} ) ！`
    }

  })

  
  const handleStatus = async () => {
    if (status === 0) return
    isShow.value = true
  }

  const beforeClose = async (action) => {
    if (action === 'cancel') {
      return true
    }
    setTimeout(() => {
      toVip(shopId)
    }, 0);
    return true
  }
  
  const init = async () => {
    const {rid} = globalData.value
    if (![2,3,99].includes(rid)) return // 非管理员无需提示
    let ret = await shopInfoManage.getData(shopId)
    ret = ret[0]
    if (ret.level === 0) return // 非会员无需提示
    ret = await vipInfoManage.getData(shopId)
    vipInfo.value = ret[0]
    console.log('status1', status)
    valiExpired()
    console.log('status2', status)
    valiLocalStorage()
    console.log('status3', status)
    handleStatus()
  }

  init()

  return {
    isShow, beforeClose, displayTips
  }
  
}