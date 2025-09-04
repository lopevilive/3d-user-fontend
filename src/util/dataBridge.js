
// 数据桥梁
class DataBridge {
  constructor() {
    this.data = null
    this.resolve = null
    this.reject = null
  }

  async getPromise (data) {
    this.data = data || null
    const p = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
    return p
  }

  updateData(d) {
    this.data = d
  }

  getData() {
    return this.data
  }

  async finish(){
    if (this.resolve) {
      this.resolve(this.data)
    }
    this.destory()
  }

  async cancel() {
    if (this.reject) {
      this.reject(null)
    }
    this.destory()
  }

  async destory () {
    this.resolve = null
    this.reject = null
    this.data = null
  }
}


export const mulTypeInstance = new DataBridge()