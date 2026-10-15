import { globalData } from '@/store'
import { isToday } from '@/util'
import { reportCgi } from '@/http'


const data = {
  admin: {
    member: 10,
    openTimes: 99,
    viewDetial: 888,
  },
  custom: {
    member: 10,
    openTimes: 99,
    viewDetial: 888,
  }
}


class ReportManage {
  constructor() {
    this.localKey = 'report_key'
    this.openTimesCache = {}
  }

  getLocalData(shopId) {
    let localData = localStorage.getItem(this.localKey) || '{}'
    localData = JSON.parse(localData)
    if (!localData[shopId]) localData[shopId] = {}
    if (!localData[shopId]['member']) localData[shopId]['member'] = 1732033111000 //这里随便设置一个很久以前的时间
    return localData
  }

  setLocalData(data) {
    localStorage.setItem(this.localKey, JSON.stringify(data))
  }
  async toReport(payload) { // 外部调用
    if (globalData.value.rid === 99) return //  超级管理员不上报
    const ownerList = globalData.value.userInfo?.ownerList || []
    const adminList = globalData.value.userInfo?.adminList || []
    const isAdmin = [...ownerList, ...adminList].includes(payload.shopId)
    let payloadField = isAdmin ? 'admin' : 'custom'
    const { shopId, field } = payload
    if (!shopId) return
    if (!field) return
    payloadField = `${payloadField}.${field}`
    await reportCgi({shopId, field: payloadField})
  }
  
  async handleMember({shopId}) {  // 统计人数，每天统计一次
    const localData = this.getLocalData(shopId)
    const shopData = localData[shopId]
    const ret = isToday(shopData['member'])
    if (ret) return // 今天已经上报过了
    shopData['member'] = Date.now()
    this.setLocalData(localData)
    await this.toReport({ field: 'member', shopId })
  }

  async handleOpenTims({shopId}) { // 统计打开次数，每次打开都统计一次
    if (this.openTimesCache[shopId]) return
    this.openTimesCache[shopId] = true
    await this.toReport({  field: 'openTimes',  shopId })
  }

  async report(payload) { // 外部调用
    const {shopId} = payload
    if (!shopId) return
    await this.handleMember(payload)
    await this.handleOpenTims(payload)
  }
}

export const reportInstance = new ReportManage()