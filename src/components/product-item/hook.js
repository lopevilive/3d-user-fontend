import { ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productDel, moveTopProduct, productMod, modProductPos } from '@/http'
import { commonFetch, EE, getImageUrl, getSpecPrices, getTypeName, formatAttrs } from '@/util'
import { globalData } from '@/store'
import { showConfirmDialog } from 'vant';

export const useProductItem = (props, emits) => {
  const router = useRouter()
  const route = useRoute()

  const shopId = + route.params.shopId
  const posTop = ref(5)
  const posDown = ref(5)

  const actions = computed(() => {
    const {status, sort} = props.data
    let ret1 = [
      {
        name: '修改产品', color: '#5794f7',
        action: () => {
          const {id} = props.data
          router.push({name: 'product-edit', params: {id}})
        }
      },
    ];

    const act = status === 0 ? '下架' : '上架'
    const color = status === 0 ? '#f29b73' : '#58bd6b'
    ret1.push({
      name: `${act}产品`, color,
      action: async () => {
        const {id} = props.data
        await showConfirmDialog({
          title: `${act}产品`,
          message: `确定要${act}该产品吗?`
        })
        await commonFetch(productMod, {id, status: status === 0 ? 1 : 0, shopId})
        emits('update', {type: 'status', data: props.data})
      }
    })

    ret1.push({
      name: '删除产品', color: '#ee0a24',
      action: async () => {
        const {id} = props.data
        await showConfirmDialog({
          message: `确定要删除这个产品吗?`
        })
        await commonFetch(productDel, {id, shopId})
        emits('update', {type: 'del', data: props.data})
      }
    })

    let ret2 = []

    if (status === 0) {
      if (sort !== 0) {
        ret2.push({
          name: '取消置顶', color: '#f29b73',
          action: async () => {
            const {id} = props.data
            await commonFetch(productMod, {id, shopId, sort: 0})
            emits('update', {type: 'sort', data: props.data})
          }
        })
      } else {
        ret2.push({
          name: '置顶产品', color: '#5794f7',
          action: async () => {
            const {id} = props.data
            await commonFetch(moveTopProduct, {id, shopId})
            emits('update', {type: 'sort', data: props.data})
          }
        })
      }
    }

    if (props.data.sort === 0) {
      ret2.push({ name: '前移', color: '#5794f7'})
      ret2.push({ name: '后移', color: '#5794f7'})
    }
    const ret = [ret1]
    if (props.isShowSort) ret.push(ret2)
    return ret
  })

  const actionRef = ref()
  const selectHandle = (item) => {
    actionRef.value.close()
    const {action} = item
    action()
  }


  const  settingClickHandle = () => {
    actionRef.value.show()
  }

  const handleClick = () => {
    const {id, desc} = props.data

    if (globalData.value.editStatus === 1) {
      router.push({name: 'product-edit', params: {id}})
    } else {
      router.push({
        name: 'product-detial',
        params: {id},
        query: {title: desc, imageUrl: urlDisplay.value},
      })
    }
  }

  const urlDisplay = computed(() => {
    const {url} = props.data
    if (!url) return ''
    return getImageUrl(url.split(',')[0])
  })

  const checked = ref(false)

  const changeHandle = (val) => {
    const {id} = props.data
    emits('selected', {id, val})
  }

  const removeChecked = () => {
    checked.value = false
    changeHandle(false)
  }

  EE.on('removeAllSelected', removeChecked)

  onUnmounted(() => {
    EE.removeListener('removeAllSelected', removeChecked)
  })

  const displayAttrs = computed(() => {
    let attr = formatAttrs(props.data.attr, props.shopInfo)
    let str = ''
    const { productType } = props.data
    if (productType) {
      const ret = getTypeName(productType)
      if (ret) str = ret
    }

    for(const item of attr) {
      if (!item.val) continue
      if (['其他'].includes(item.val)) continue
      if (str) str += ' | '
      str += item.val
    }
    return str
  })

  const priceDisplay = computed(() => {
    const { price, isSpec, specs } = props.data
    if (isSpec === 0) return price
    let list = JSON.parse(specs)
    const {min, max} = getSpecPrices(list)
    if (max === min) return `${max}`
    return `${min} ~ ${max}`
  })

  const isShowSticky = computed(() => {
    const {rid} = globalData.value
    if (![2,3,99].includes(rid)) return false
    if (props.data?.sort > 0) return true
    return false
  })

  const modPosHandle = async (data) => {
    let type = ''
    let step = 0
    if (data.name === '前移') {
      type = 'top'
      step = Number(posTop.value)
    }
    if (data.name === '后移') {
      type = 'down'
      step = Number(posDown.value)
    }
    actionRef.value.close()
    if (!step) return
    const preId = await commonFetch(modProductPos, {shopId, id: props.data.id, step, type, productType: props.productType })
    emits('update', {type: 'pos', data: {id: props.data.id, preId, type}})
  }
  

  return {
    actions, selectHandle, settingClickHandle, handleClick, urlDisplay, checked, changeHandle,
    displayAttrs, isShowSticky, priceDisplay, actionRef, posTop, posDown, modPosHandle
  }
}