import { getShop, getWatermarkCfg, getVipInfo } from '@/http'
import { commonFetch } from '@/util'

class DataManage {
  constructor (getFn, key) {
    this.getFn = getFn
    this.key = key || 'id'
    this.fetchIngList = [] // 正在请求的shopid
    this.execTasks = [] // 待执行的回调任务
    this.dataStore = [] // 保存的 data 信息
  }

  toExec () {
    let list = this.execTasks
    this.execTasks = []
    for (const task of list) {
      const {idList, resolve, reject } = task
      let ret = []
      let pass = true

      for (const id of idList) {
        const matchItem = this.dataStore.find((item) => item.shopId === id)
        if (!matchItem) {
          pass = false
          break
        }
        if (matchItem.dirty === true && !matchItem.err) {
          pass = false
          break
        }
        if (!matchItem.err) ret.push({...matchItem.data})
      }
      if (!pass) {
        this.execTasks.push(task)
        continue
      }
      resolve(ret)
    }
  }

  async toFetch (idList) {
    const realList = []
    for (const id of idList) {
      if (this.fetchIngList.includes(id)) continue
      const idx = this.dataStore.findIndex((item) => {
        if (item.shopId === id && item.dirty === false) return true
      })
      if (idx !== -1) continue
      realList.push(id)
      this.fetchIngList.push(id)
    }
    if (realList.length === 0) {
      this.toExec()
      return
    }

    try {
      const fn = this.getFn()
      let payload = realList
      if (payload.length === 1) payload = payload[0]
      let dataList = await commonFetch(fn, {shopId: payload})
      if (!Array.isArray(dataList)) dataList = [dataList]
      for (const id of realList) {
        const resItem = dataList.find((item) => item[this.key] === id)
        const matchItem = this.dataStore.find((item) => item.shopId === id)
        if (!resItem) {
          if (matchItem) {
            matchItem.dirty = true
            matchItem.err = new Error('数据不存在')
          } else {
            this.dataStore.push({shopId: id, dirty: false, err: new Error('数据不存在')})
          }
        } else {
          if (matchItem) {
            matchItem.dirty = false
            matchItem.data = resItem
            matchItem.err = null
          } else {
            this.dataStore.push({shopId: id, dirty: false, data: resItem})
          }
        }
      }
    } catch(e) {
      for (const id of realList) {
        const matchItem = this.dataStore.find((item) => item.shopId === id)
        if (matchItem) {
          matchItem.dirty = true
          matchItem.err = e
        } else {
          this.dataStore.push({shopId: id, dirty: true, err: e})
        }
      }
    } finally {
      for (const id of realList) {
        const idx = this.fetchIngList.findIndex((item) => item === id)
        if (idx !== -1) this.fetchIngList.splice(idx, 1)
      }
    }
    this.toExec()
  }

  async getData (shopId) {
    let idList = shopId
    if (!Array.isArray(shopId)) idList = [shopId]
    idList = idList.map((item) => Number(item))
    const ret = []
    for (const id of idList) {
      for (const item of this.dataStore) {
        if (item.shopId === id && item.dirty === false && item.data) ret.push({...item.data})
      }
    }
    if (ret.length === idList.length) return ret
    const p = new Promise((resolve, reject) => {
      this.execTasks.push({ idList, resolve, reject })
    })
    this.toFetch(idList)
    return p
  }

  dirty (shopId) {
    for (const item of this.dataStore) {
      if (item.shopId === +shopId) item.dirty = true
    }
  }
}

export const shopInfoManage = new DataManage(() => getShop)

export const watermarkManage = new DataManage(() => getWatermarkCfg, 'shopId')

export const vipInfoManage = new DataManage(() => getVipInfo, 'shopId')