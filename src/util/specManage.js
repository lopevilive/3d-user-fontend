
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

  async saveHandle (payload) {
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