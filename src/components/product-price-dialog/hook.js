import { ref } from 'vue'
import { showToast } from 'vant';


export const useProductPriceDialog = () => {
  const price = ref('')
  const isSpec = ref(0)
  const specs = ref('')
  const show = ref(false)

  let resolve
  let reject

  const getPrice = async () => {
    show.value = true
    price.value = ''
    isSpec.value = 0
    specs.value = ''
    setTimeout(() => {
      try {
        priceModRef.value.init()
      } catch(e){
        console.error(e)
      }
    }, 0)
    return new Promise((a, b) => {
      resolve = a
      reject = b
    })
  }

  const priceModRef = ref()
  const beforeClose = (action) => {
    if (action === 'cancel') {
      reject()
      return true
    }
    const ret = priceModRef.value.valiPrice()
    if (ret !== true) {
      showToast(ret)
      return false
    }
    resolve({
      price: price.value,
      isSpec: isSpec.value,
      specs: specs.value
    })
    return true
  }

  return {
    getPrice, price, show, beforeClose, isSpec, specs, priceModRef
  }

}