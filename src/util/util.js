import { showNotify, showSuccessToast, showToast } from 'vant';
import md5 from 'crypto-js/md5'
import latin1 from 'crypto-js/enc-latin1'
import hex from 'crypto-js/enc-hex'
import { EventEmitter } from 'eventemitter3'
import copy from 'copy-to-clipboard';
import { toPng } from 'html-to-image';
import { globalData } from '@/store'
import { setViewLogs } from '@/http'
import { getBusinessCfg, E_vip_map, shopInfoManage, E_illegal_reg, vipInfoManage } from '@/util'


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
    const { viewLogs=[], ownerList=[], adminList=[], demoShops=[] } = globalData.value.userInfo
    if (ownerList.includes(shopId)) return
    if (adminList.includes(shopId)) return
    if (demoShops.includes(shopId)) return
    const idx = viewLogs.findIndex((item) => item === shopId)
    if (idx !== -1) {
      if ((idx + 1) === viewLogs.length) return
      viewLogs.splice(idx, 1)
    }
    let newList = viewLogs
    newList.push(shopId)
    newList = newList.slice(-this.maxLen)
    globalData.value.userInfo.viewLogs = newList
    setViewLogs({list: [...newList]})
  }
  getlog () {
    let localLogs = localStorage.getItem('viewItem') // 兼容历史数据，后续可删除这个逻辑
    if (!localLogs) localLogs = '[]'
    localLogs = JSON.parse(localLogs)
    const { viewLogs=[], ownerList=[], adminList=[], demoShops=[] } = globalData.value.userInfo
    let s = new Set([...viewLogs, ...localLogs])
    s = [...s]
    const ret = []
    for (const item of s) {
      if (ownerList.includes(item)) continue
      if (adminList.includes(item)) continue
      if (demoShops.includes(item)) continue
      ret.push(item)
    }
    return ret.reverse()
  }
}

export const viewLog = new ViewLog()

export const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/

export const emojiReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

export const toContactSys = async () => {
  const inApp = isInApp()
  if (!inApp) {
    showToast('请在小程序内打开')
    return
  }
  const payload = {
    qrcodeUrl: '//upload-1259129443.cos.ap-guangzhou.myqcloud.com/5_3_dda7b2170dac6b8a161f072b4b6a62b9.jpg',
    message: `长按识别二维码～`
  }
  let payloadStr = encodeURIComponent(JSON.stringify(payload))
  wx.miniProgram.navigateTo({url: `../viewQrCode/viewQrCode?payload=${payloadStr}`})
}


export const toLogin = (fullPath)  => {
  wx.miniProgram.redirectTo({url: `../login/login?src_path=${encodeURIComponent(fullPath)}`})
}

export const toVip = async (shopId) => {
  const inApp = isInApp()
  if (!inApp) return showToast('请在小程序内打开')
  let vipInfo = await vipInfoManage.getData(shopId)
  vipInfo = vipInfo[0]
  let shopInfo = await shopInfoManage.getData(shopId)
  shopInfo = shopInfo[0]
  const shopData = {
    shopId, name: shopInfo.name,
    url: getImageUrl(shopInfo.url.split(',')[0])
  }
  const payloadStr = encodeURIComponent(JSON.stringify(vipInfo))
  const shopStr = encodeURIComponent(JSON.stringify(shopData))
  wx.miniProgram.navigateTo({url: `../vip/vip?shopInfo=${shopStr}&payload=${payloadStr}`})
}

export const copyStr = (str) => {
  if (!str) return
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
  // const inApp = isInApp()
  // if (!inApp) {
  //   showToast('请在小程序内打开')
  //   return
  // }
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

export const getFlexW = (w) => {
  return (window.innerWidth * w) / 375
}

export const textToPngFile = async (text, options = {}) => {
  // 创建临时DOM节点
  const node = document.createElement('div');
  Object.assign(node.style, {
    display: 'inline-block',
    fontSize: options.fontSize || '24px',
    color: options.color || '#000',
    whiteSpace: 'nowrap' // 防止文字换行
  });
  node.textContent = text;

  // 插入文档流（隐藏）
  // node.style.position = 'absolute';
  // node.style.left = '-9999px';
  document.body.appendChild(node);

  try {
    // 生成PNG dataURL
    const dataUrl = await toPng(node, {
      skipFonts: true, // 跳过字体检测
      cacheBust: true, // 避免缓存
    });

    // 转换为File对象
    const file = await fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => new File([blob], 'text.png', { type: 'image/png' }));

    return file;
  } finally {
    // 清理临时节点
    document.body.removeChild(node);
  }
}

export const formatWatermarkPayload = (watermarkCfg, shopId) => {
  const {
    type, text, configkey, previewUrl, fontsize, fill, degree, gravity,
    dissolve, batch, image, textUrl
  } = watermarkCfg
  let cfg = {
    fontsize, fill, degree, gravity, dissolve, batch,
    image: image || '',
    textUrl: textUrl || ''
  }
  cfg = JSON.stringify(cfg)
  const payload = { shopId, type, configkey, text: text || '', previewUrl, cfg }
  return payload
}

export const getSpecPrices = (list) => {
  let min = -1
  let max = -1
  for (const item of list) {
    if (item.price === '') continue
    let specPrice = +item.price
    if (min === -1) min = specPrice
    if (max === -1) max = specPrice
    if (specPrice < min) min = specPrice
    if (specPrice > max) max = specPrice
  }
  return {
    min: min === -1 ? '' : min,
    max: max === -1 ? '' : max
  }
}

// 把 ,a,b, 转成 [a,b]
export const formatPoint = (str) => {
  let ret = []
  if (!str) return ret
  let s = String(str)
  let sArr = s.split(',')
  for (const item of sArr) {
    if (!item) continue
    ret.push(item)
  }
  return ret
}

export const formatType = (val) => {
  const ret = { type1: null, type2: null }
  if (!val) return ret
  let str = String(val)
  const arr = formatPoint(str)
  str = arr[0]
  if (!str) return ret
  let [val1, val2] = str.split('-')
  if (val1) ret.type1 = Number(val1)
  if (val2) ret.type2 = Number(val2)
  return ret
}

export const getTypeName = (typeStr) => {
  let ret = ''
  const {type1, type2} = formatType(typeStr)
  for (const item of globalData.value.productTypes) {
    if (item.id === type1) ret = item.name
  }
  if (type2) {
    for (const item of globalData.value.productTypes) {
      if (item.id === type2) ret = `${ret}/${item.name}`
    }
  }
  return ret
}

export const formatAttrs= (str, shopInfo = {}) => {
  let attr = str || '[]'
  attr = JSON.parse(attr)
  let ret = []
  const {id, attrs, business} = shopInfo
  if (id) {
    const defautSort = []
    const {attrCfg} = getBusinessCfg(business)
    for (const item of attrCfg) {
      defautSort.push(item)
    }
    const cfgAttrs = JSON.parse(attrs || '[]')
    for (const item of cfgAttrs) {
      const idx = defautSort.findIndex((m) => m.name === item.name)
      if (idx !== -1) continue
      defautSort.push(item)
    }
    for (const item of defautSort) {
      const matchedItem = attr.find((m) => m.name === item.name)
      if (matchedItem) ret.push(matchedItem)
    }
    for (const item of attr) {
      const idx = ret.findIndex((m) => m.name === item.name)
      if (idx !== -1) continue
      ret.push(item)
    }
  } else ret = attr

  return ret
}

export const isVip = (shopInfo, valiTime = true) => {
  const { level, expiredTime } = shopInfo
  let ret = false
  for (const item of E_vip_map) {
    if (item.level === level) ret = item.isVip
  }
  if (valiTime && ret) {
    const nowTime = Math.floor(Date.now() / 1000)
    if (nowTime > expiredTime) ret = false
  }
  return ret
}

export const valiIllegalStr = (str) => {
  if (!str) return
  for (const item of E_illegal_reg) {
    let reg = ''
    let msg = ''
    for (const s of item) {
      if (!reg) {
        reg = s;
        msg = s
        continue
      }
      reg += `.{0,5}${s}`
      msg += s
    }
    reg = new RegExp(reg)
    if (reg.test(str)) return msg
  }
}

export const getMulSpecName = (idList, mulSpecs) => {
  const ret = []
  for (const id of idList) {
    if ([undefined, null].includes(id)) {
      ret.push(null)
      continue
    }
    for (const item of mulSpecs) {
      for (const subItem of item.list) {
        if (id === subItem.id) ret.push(subItem.name)
      }
    }
  }
  return ret
}

export const getSelectedItemByIdList = (idList, mulSpecPriceList) => {
  for (const priceItem of mulSpecPriceList) {
    let isMatched = true
    for (let i = 0; i < priceItem.list.length; i ++) {
      if (priceItem.list[i] === idList[i]) continue
      isMatched = false
    }
    if (isMatched) return priceItem
  }
  return null;
}

export const getMulSpecUrl = (idList, mulSpecs, mulSpecPriceList) => {
  let cfgUrl = '' // 配置的规格图片
  let matchedUrl = '' // 组合规格图片
  for  (let i = 0; i < mulSpecs.length; i ++) {
    if (mulSpecs[i].useImg !== 1) continue
    const id = idList[i]
    if ([undefined, null].includes(id)) continue
    const matchedItem = mulSpecs[i].list.find((item) => item.id === id)
    cfgUrl = matchedItem?.url || ''
  }

  const tmpIdx = idList.findIndex((item) => [undefined,null].includes(item))
  if (tmpIdx !== -1) return cfgUrl || '' // 还没选齐规格
  for (const priceItem of mulSpecPriceList) {
    let matched = true
    for (let i = 0; i < priceItem.list.length; i ++ ) {
      if (idList.includes(priceItem.list[i])) continue
      matched = false
      break
    }
    if (matched) {
      matchedUrl = priceItem.url || ''
      break
    }
  }
  if (matchedUrl === 'none') return ''
  if (matchedUrl) return matchedUrl
  return cfgUrl || ''
}

// name: a｜b｜c
export const mulSpecName2Ids = (name, mulSpecs) => {
  const names = name.split('｜')
  const ret = []
  for (let i = 0; i < names.length; i++) {
    const cfgItem = mulSpecs[i]
    for (const item of cfgItem.list) {
      if (item.name === names[i]) ret.push(item.id)
    }
  }
  return ret
}

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 判断是否今天
export const isToday = (date) => {
  const today = new Date();
  const givenDate = new Date(date); // 确保参数转换为Date对象

  return (
    givenDate.getFullYear() === today.getFullYear() &&
    givenDate.getMonth() === today.getMonth() &&
    givenDate.getDate() === today.getDate()
  );
}