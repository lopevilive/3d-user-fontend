import { shopInfoManage, commonFetch } from '@/util'
import { modShopStatus } from '@/http'


class SpecManage {
  constructor() {
    this.resolve = null
    this.reject = null
    this.isSpec = null
    this.specDetials = null // JSON 字符串
  }

  async getPrice ({isSpec, specDetials}) {
    this.isSpec = isSpec
    this.specDetials = specDetials
    const p = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
    return p
  }

  updateSpecDetials(specDetials) {
    this.specDetials = specDetials
  }

  getRawData () {
    return { isSpec: this.isSpec || 1, specDetials: this.specDetials }
  }

  async syncSpecsCfg (payload, shopId) {
    if (!shopId) return
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo?.[0]
    if (!shopInfo) return
    const rawStr = shopInfo.specsCfg || ''
    const cfgs = JSON.parse(rawStr || '{}')
    if (!cfgs?.singleCfg) cfgs.singleCfg = []
    if (!cfgs?.mulCfg) cfgs.mulCfg = []

    const specDetials = JSON.parse(payload.specDetials)
    if (this.isSpec === 1) { // 处理单级规格
      const {singleSpecs} = specDetials
      let newList = []
      for (const item of singleSpecs) {
        if (['大 (示例)', '小 (示例)'].includes(item.name)) continue
        newList.push({name: item.name})
      }
      for (const item of cfgs.singleCfg) {
        const idx = newList.findIndex((a) => a.name === item.name)
        if (!item.name) continue
        if (idx !== -1) continue
        newList.push(item)
      }
      newList = newList.splice(0, 9)
      cfgs.singleCfg = newList
    }
    if (this.isSpec === 2) { // 多级规格
      const mulSpecs = specDetials.mulSpecs || []
      let newList = []
      for  (const item of mulSpecs) {
        if (['颜色 (示例)', '尺码 (示例)'].includes(item.name)) continue
        const subList = item.list.map((a) => a.name)
        newList.push({name: item.name, list: subList})
      }
      for (const item of cfgs.mulCfg) {
        const idx = newList.findIndex((a) => a.name === item.name)
        if (!item.name) continue
        if (idx !== -1) continue
        newList.push(item)
      }
      newList = newList.splice(0, 9)
      cfgs.mulCfg = newList
    }
    const newStr = JSON.stringify(cfgs)
    if (newStr === rawStr) return
    await this.updateSpecsCfg(newStr, shopId)
  }

  async updateSpecsCfg (cfgStr, shopId){
    await commonFetch(modShopStatus, {shopId, specsCfg: cfgStr})
    shopInfoManage.dirty(shopId)
  }
  
  async saveHandle (payload, shopId) {
    await this.syncSpecsCfg(payload ,shopId)
    if (this.resolve) {
      this.resolve(payload)
    }
  }

  async cancelHandle () {
    if (this.reject) {
      this.reject(null)
    }
  }

  async destory () {
    this.resolve = null
    this.reject = null
    this.isSpec = null
    this.specDetials = null
  }

}

export const specManageInstance = new SpecManage() // 这里是单例