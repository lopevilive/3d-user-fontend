import { showNotify, showSuccessToast } from 'vant';
import md5 from 'crypto-js/md5'
import latin1 from 'crypto-js/enc-latin1'
import hex from 'crypto-js/enc-hex'
import {EventEmitter} from 'eventemitter3'


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
    showNotify({message: e?.msg || '系统出错，请联系管理员'})
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

export const  getImageUrl = (url, quality = 40) => {
  // return url
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


export const isInApp = async () => {
  if (window.__wxjs_environment === 'miniprogram') return true
  return false
}

class ViewLog {
  constructor() {
    this.maxLen = 5 // 保留多少条记录
  }
  setlog (shopId) {
    shopId = Number(shopId)
    if (!shopId) return
    let viewStore = this.getlog()
    if (!viewStore.includes(shopId)) {
      viewStore.push(shopId)
    }
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
