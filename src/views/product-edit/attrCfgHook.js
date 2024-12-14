import { computed, ref } from 'vue'
import { shopMod } from '@/http'
import { commonFetch, shopInfoManage } from '@/util'
import { useRoute } from 'vue-router'

export const useAttrCfgHook = (props, emits) => {
  const route = useRoute()
  const shopId = +route.params.shopId

  const editList = ref([])
  
  const dataList = computed(() => {
    if (!props?.modelValue) return []
    return JSON.parse(props.modelValue)
  })

  const dbAttrs = ref([])
  const getDbAttrs = async () => {
    let shopInfo = await shopInfoManage.getShopInfo(shopId)
    let str = shopInfo?.[0]?.attrs || ''
    if (!str) str = '[]'
    dbAttrs.value = JSON.parse(str)
  }
  getDbAttrs()

  const renderList = computed(() => {
    let ret = []
     // 从配置里面组装数据
    for (const attrItem of props.attrCfg) {
      let obj = {...attrItem, isCustom: false, val: '', customOpts: []}
      const match = dataList.value.find((dataItem) => dataItem.name === obj.name)
      if (match) {
        obj.val = match.val || ''
        obj.customOpts = match.customOpts || []
      }
      const dbItem = dbAttrs.value.find((item) => item.name === obj.name)
      if (dbItem) {
        obj.customOpts = [...new Set([...obj.customOpts, ...dbItem.customOpts])]
      }
      obj.customOpts = obj.customOpts.filter((item) => {
        if (attrItem.opts.includes(item)) return false
        return true
      })
      let s = new Set()
      if (!editList.value.includes(obj.name) && obj.val)  s.add(obj.val)
      for (const str of obj.customOpts) {
        s.add(str)
      }
      for (const str of obj.opts) {
        s.add(str)
      }
      obj.displayOpts = [...s]
      ret.push(obj)
    }

    // db 里面的数据
    for (const dbItem of dbAttrs.value) {
      const isMatched = ret.find((item) => item.name === dbItem.name)
      if (isMatched) continue
      let obj = {...dbItem, val: '', isCustom: true, type: 'single'}
      const dataItem = dataList.value.find((item) => item.name === dbItem.name)
      if (dataItem) {
        obj.val = dataItem.val || ''
        obj.customOpts = [...new Set([...dataItem.customOpts, ...dbItem.customOpts])]
      }
      let s = new Set()
      if (!editList.value.includes(obj.name) && obj.val)  s.add(obj.val)
      for (const str of obj.customOpts) {
        s.add(str)
      }
      obj.displayOpts = [...s]
      ret.push(obj)
    }

    for (const dataItem of dataList.value) {
      const isMatched = ret.find((item) => item.name === dataItem.name)
      if (isMatched) continue
      let obj = {...dataItem, isCustom: true, type: 'single'}
      let s = new Set()
      if (!editList.value.includes(obj.name) && obj.val)  s.add(obj.val)
      for (const str of obj.customOpts) {
        s.add(str)
      }
      obj.displayOpts = [...s]
      ret.push(obj)
    }
    
    return ret
  })

  const optClickHandle = (data, opt) => {
    editList.value.push(data.name)
    const list = [...dataList.value]
    const idx = list.findIndex((item) => item.name === data.name)
    const dbItem = dbAttrs.value.find((item) => item.name === data.name)
    const customOpts = dbItem?.customOpts || []
    if (idx !== -1) { // 修改
      const matchItem = list[idx]
      if (matchItem.val === opt) { // 取消选择
        matchItem.val = ''
        matchItem.customOpts = [...new Set([...matchItem.customOpts,...customOpts])]
      } else{
        matchItem.val = opt
        matchItem.customOpts = [...new Set([...matchItem.customOpts,...customOpts])]
      }
    } else { // 新增
      const newItem = { name: data.name, val: opt, customOpts}
      list.push(newItem)
    }
    emits('update:modelValue', JSON.stringify(list))
  }

  const customKeyRef = ref()
  // 自定义属性
  const customKeyHandle = () => {
    customKeyRef.value.show()
  }
  const customUpdate = async ({name}) => {
    dbAttrs.value.push({name, customOpts: []})
    await commonFetch(shopMod, {id: shopId, attrs: JSON.stringify(dbAttrs.value)})
    shopInfoManage.dirty(shopId)
  }

  const customDelHandle = async (data) => {
    const list = [...dataList.value]
    const idx = list.findIndex((item) => item.name === data.name)
    if (idx !== -1) {
      list.splice(idx, 1)
      emits('update:modelValue', JSON.stringify(list))
    }
    const dbIdx = dbAttrs.value.findIndex((item) => item.name === data.name)
    if (dbIdx !== -1) {
      dbAttrs.value.splice(dbIdx, 1)
      await commonFetch(shopMod, {id: shopId, attrs: JSON.stringify(dbAttrs.value)})
      shopInfoManage.dirty(shopId)
    }
  }

  const optContentRefs = ref([])
  const customOptsRef = ref()
  // 自定义选项
  const customOptHandle = (data) => {
    customOptsRef.value.show(data)
  }
  const customOptsUpdate= async ({data, list}) => {
    const matched = dbAttrs.value.find((item) => item.name === data.name)
    if (matched) {
      matched.customOpts = list
    } else {
      dbAttrs.value.push({name: data.name, customOpts: list})
    }
    await commonFetch(shopMod, {id: shopId, attrs: JSON.stringify(dbAttrs.value)})
    shopInfoManage.dirty(shopId)
    for (const dom of optContentRefs.value) {
      try {
        dom.scrollLeft = 0;
      } catch(e){}
    }
  }


  return {
    optClickHandle,
    renderList,
    customKeyHandle,
    customOptHandle,
    customKeyRef,
    customUpdate,
    customDelHandle,
    customOptsRef,
    customOptsUpdate,
    optContentRefs
  }
}


// let tmp = {
//   name: '风格',
//   type: 'single',
//   opts: ['现代简约','北欧风格','新中式','轻奢','复古风','意式极简','原木风','奶油风','地中海'],
//   customOpts: ['好看的'], // 自定义的选项
//   isCustom: false // 是否自定义的属性
// }

// let dbTmp = {
//   name: '风格',
//   val: '现代简约', // 选中的值
//   customOpts: ['好看的'],
// }