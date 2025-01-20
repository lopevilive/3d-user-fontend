import { showNotify, showSuccessToast, showToast } from 'vant';
import md5 from 'crypto-js/md5'
import latin1 from 'crypto-js/enc-latin1'
import hex from 'crypto-js/enc-hex'
import {EventEmitter} from 'eventemitter3'
import { getShop } from '@/http'
import copy from 'copy-to-clipboard';


class LoadingManage {
  constructor() {
    this.count = 0
    this.loadingRef = null
  }
  start() {
    this.count ++
    try {
      this.loadingRef.value = true
    } catch(e) {}
  }
  stop() {
    this.count --
    setTimeout(() => {
      if (this.count === 0) {
        try {
          this.loadingRef.value = false
        } catch(e) {}
      }
    }, 0);
  }
  setRef (ref) {
    this.loadingRef = ref
  }
  getRef() {
    return this.loadingRef
  }
}

export const globalLoading = new LoadingManage()

export const commonFetch = async (method, paylaod, msg) => {
  let ret = null
  try {
    globalLoading.start()
    ret = await method(paylaod)
    ret = ret?.data
    if (msg) showSuccessToast(msg)
    return ret
  } catch(e) {
    showNotify({message: e?.msg || e?.message || '系统出错，请联系开发员'})
    console.error(e)
    throw(e)
  } finally {
    globalLoading.stop()
  }
}

export const md5File = async (file) => {
  const suffix = getSuffix(file.name)
  const fileReader = new FileReader()
  fileReader.readAsBinaryString(file);
  const res = await new Promise((resolve) => {
    fileReader.onloadend = (ev) => {
      const md5Str = md5(latin1.parse(ev.target.result)).toString(hex);
      resolve(`${md5Str}.${suffix}`)
    }
  })
  return res
}

export const getSuffix = (str) => {
  let reg = /.*\.(.*)$/
  if (reg.test(str)) {
    return RegExp.$1 || ''
  }
  return ''
}

export const getImageUrl = (url, quality = 40) => {
  if (!url) return url
  return `${url}?imageMogr2/quality/${quality}`
}

export const keyReplace = (list, rules) => {
  // {key: 'value', val: 'text'}
  const ret = []
  for (const item of list) {
    const tmpItem = {...item}
    for (const source of Object.keys(rules)) {
      const target = rules[source]
      tmpItem[target] = tmpItem[source]
      delete tmpItem[source]
    }
    ret.push(tmpItem)
  }
  return ret
}

export const EE = new EventEmitter()


export const isInApp = () => {
  if (window.__wxjs_environment === 'miniprogram') return true
  return false
}

class ViewLog {
  constructor() {
    this.maxLen = 10 // 保留多少条记录
  }
  setlog (shopId) {
    shopId = Number(shopId)
    if (!shopId) return
    let viewStore = this.getlog()
    let idx = viewStore.findIndex((item) => item === shopId)
    if (idx !== -1) {
      viewStore.splice(idx, 1)
    }
    viewStore.push(shopId)
    viewStore = viewStore.slice(-this.maxLen)
    localStorage.setItem('viewItem', JSON.stringify(viewStore))
  }
  getlog () {
    let viewStore = localStorage.getItem('viewItem')
    if (!viewStore) viewStore = '[]'
    viewStore = JSON.parse(viewStore)
    return viewStore
  }
}

export const viewLog = new ViewLog()

export const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/

export const toContactSys = async () => {
  const inApp = isInApp()
  if (!inApp) return
  const payload = {
    qrcodeUrl: '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/WechatIMG619.jpg',
    message: `长按识别二维码～`
  }
  let payloadStr = encodeURIComponent(JSON.stringify(payload))
  wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
}

class ShopInfoManage {
  constructor () {
    this.fetchIngList = [] // 正在请求的shopid
    this.execTasks = [] // 待执行的回调任务
    this.shopData = [] // 保存shop的信息
  }

  toExec () {
    let list = this.execTasks
    this.execTasks = []
    for (const task of list) {
      const {idList, resolve, reject } = task
      let ret = []
      let pass = true

      for (const id of idList) {
        const matchItem = this.shopData.find((item) => item.shopId === id)
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
      const idx = this.shopData.findIndex((item) => {
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
      const dataList = await commonFetch(getShop, {shopId: realList})
      for (const id of realList) {
        const resItem = dataList.find((item) => item.id === id)
        const matchItem = this.shopData.find((item) => item.shopId === id)
        if (!resItem) {
          if (matchItem) {
            matchItem.dirty = true
            matchItem.err = new Error('画册不存在')
          } else {
            this.shopData.push({shopId: id, dirty: true, err: new Error('画册不存在')})
          }
        } else {
          if (matchItem) {
            matchItem.dirty = false
            matchItem.data = resItem
            matchItem.err = null
          } else {
            this.shopData.push({shopId: id, dirty: false, data: resItem})
          }
        }
      }
    } catch(e) {
      for (const id of realList) {
        const matchItem = this.shopData.find((item) => item.shopId === id)
        if (matchItem) {
          matchItem.dirty = true
          matchItem.err = e
        } else {
          this.shopData.push({shopId: id, dirty: true, err: e})
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

  async getShopInfo (shopId) {
    let idList = shopId
    if (!Array.isArray(shopId)) idList = [shopId]
    idList = idList.map((item) => Number(item))
    const ret = []
    for (const id of idList) {
      for (const item of this.shopData) {
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
    for (const item of this.shopData) {
      if (item.shopId === +shopId) item.dirty = true
    }
  }
}

export const shopInfoManage = new ShopInfoManage()
window.shopInfoManage = shopInfoManage // todo


export const toLogin = (fullPath)  => {
  wx.miniProgram.redirectTo({url: `../login/login?src_path=${encodeURIComponent(fullPath)}`})
}

export const copyStr = (str) => {
  const res = copy(str)
  if (res) showSuccessToast('复制成功～')
}

const sceneMap = { name: 'a', shopId: 'b', id: 'c' }
const sceneValMap = {
  a: {'view-inventory': '1', 'product-detial': '2', 'product-manage': '3', 'mul-manage': '4'}
}

const encodeScene = (scene) => {
  let ret = ''
  for (const key of Object.keys(scene)) {
    let val = scene[key]
    const newKey = sceneMap[key]
    if (sceneValMap[newKey]) {
      val = sceneValMap[newKey][val]
    }
    if (ret) ret += '&'
    ret += `${newKey}=${val}`
  }
  return ret
}

export const decodeScene = (str) => {
  let ret = {}
  const list = str.split('&')
  for (const item of list) {
    let [key, val] = item.split('=')
    if (sceneValMap[key]) {
      const tmp = sceneValMap[key]
      for (const tmpKey of Object.keys(tmp)) {
        if (tmp[tmpKey] === val) {
          val = tmpKey
        }
      }
    }

    for (const sceneKey of Object.keys(sceneMap)) {
      if (sceneMap[sceneKey] === key) {
        key = sceneKey
      }
    }
    ret[key] = val
  }
  return ret
}

export const toSharePage = (payload = {}) => {
  const inApp = isInApp()
  if (!inApp) {
    showToast('请在小程序内打开')
    return
  }
  let query = ''
  for (const key of Object.keys(payload)) {
    let val = payload[key]
    if (key === 'url') {
      val = getImageUrl(val)
    }
    if (['desc1','desc2'].includes(key)) {
      val = JSON.stringify(val)
    }
    if (key === 'scene') {
      val = encodeScene(val)
    }
    query ? query += '&' : query += '?'
    query += `${key}=${encodeURIComponent(val)}`
  }
  wx.miniProgram.navigateTo({url: `../share-page/share-page${query}`})
}

export const sleep = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}

class RefManage {
  constructor() {
    this.instanceRef = null
  }

  setRef (refVal) {
    this.instanceRef = refVal
  }
  getRef() {
    return this.instanceRef
  }
}

export const encryRefManage = new RefManage()
