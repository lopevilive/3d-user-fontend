import { showNotify, showSuccessToast } from 'vant';
export * from './enum'


class LoadingManage {
  constructor() {
    this.count = 0
    this.loadingRef = null
  }
  start() {
    this.count ++
    this.loadingRef.value = true
  }
  stop() {
    this.count --
    if (this.count === 0) {
      this.loadingRef.value = false
    }
  }
  setRef (ref) {
    this.loadingRef = ref
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