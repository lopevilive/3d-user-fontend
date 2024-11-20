import { computed, ref } from 'vue'

export const useAttrCfgHook = (props, emits) => {

  const editList = ref([])
  
  const dataList = computed(() => {
    if (!props?.modelValue) return []
    return JSON.parse(props.modelValue)
  })

  const getLocalItem = (name) => {
    let localData = localStorage.getItem('attrCfg') || '[]'
    localData = JSON.parse(localData)
    if (name) {
      for (const item of localData) {
        if (item.name === name) return item
      }
      return null
    }
    return localData
  }

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
      const localItem = getLocalItem(obj.name)
      if (localItem) {
        obj.customOpts = [...new Set([...obj.customOpts, ...localItem.customOpts])]
      }
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

    // 从产品信息里面配置数据
    for (const dataItem of dataList.value) {
      const isMatched = ret.find((item) => item.name === dataItem.name)
      if (isMatched) continue
      let obj = {name: dataItem.name, isCustom: true, val: dataItem.val || '', customOpts: dataItem.customOpts || [], type: 'single'}
      const localItem = getLocalItem(obj.name)
      if (localItem) {
        obj.customOpts = [...new Set([...obj.customOpts, ...localItem.customOpts])]
      }
      let s = new Set()
      if (!editList.value.includes(obj.name) && obj.val)  s.add(obj.val)
      for (const str of obj.customOpts) {
        s.add(str)
      }
      obj.displayOpts = [...s]
      ret.push(obj)
    }

    // 从本地缓存里面组装数据
    const localData = getLocalItem()
    for (const localItem of localData) {
      const isMatched = ret.find((item) => item.name === localItem.name)
      if (isMatched) continue
      let obj = {...localItem, val: '', type: 'single', opts: [], isCustom: true}
      let s = new Set()
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

    
    const localItem = getLocalItem(data.name)
    const customOpts = localItem?.customOpts || []
    if (idx !== -1) { // 修改
      const matchItem = list[idx]
      if (matchItem.val === opt) { // 取消选择
        list.splice(idx,1)
      } else{
        matchItem.val = opt
        matchItem.customOpts = customOpts
      }
    } else { // 新增
      const newItem = { name: data.name, val: opt, customOpts}
      list.push(newItem)
    }
    emits('update:modelValue', JSON.stringify(list))
  }

  const customHandle = () => {

  }


  return {
    optClickHandle,
    renderList,
    customHandle
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