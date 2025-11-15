import { specManageInstance, sleep, priceReg, getSpecPrices, rand, isVip, shopInfoManage, toVip } from '@/util'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { globalData } from '@/store'
import { showToast, showConfirmDialog } from 'vant';


export const useSpecEdit = () => {
  const router = useRouter()
  const route = useRoute()

  const shopId = +route.params.shopId

  const shopInfo = ref()

  const singleSpecs = ref([]) // 单级规格
  const singleUseImg = ref(0) // 单级规格是否使用图片
  const mulSpecs = ref([]) // 多级规格
  const mulUseImg = ref(0)
  const mulSpecPriceList = ref([])

  const isSpec = ref();
  const inputDialogRef = ref()
  const uploadImgsRef = ref([])

  const getSingleDefault = () => {
    return {name: '', price: '', url: ''}
  }

  const getMulSpecIncId = () => {
    const a = Math.floor(Date.now() / 1000)
    const b = rand(100, 999)
    return `${a}${b}`
  }

  const addSpecHandle = async () => {
    if (isSpec.value === 1) { // 添加单级规格
      singleSpecs.value.push(getSingleDefault())
    }
    if (isSpec.value === 2) { // 添加多级规格分类
      const ret = await inputDialogRef.value.getVal('', {title: '添加规格分类', placeholder: '规格分类 (如：颜色、尺码)', validFn: (str) => {
        for (const item of mulSpecs.value) {
          if (item.name === str) {
            return '已存在该规格分类！'
          }
        }
      }})
      
      mulSpecs.value.push({ name: ret, list: [], useImg: 0, id: getMulSpecIncId() })
    }
  }

  const getData = () => {
    const specDetials = {
      singleSpecs: singleSpecs.value, // 单级规格数据
      mulSpecs: mulSpecs.value, // 多级规格数据 
      singleUseImg: singleUseImg.value, // 单级规格是否使用图片
      mulUseImg: mulUseImg.value, // 多级规格是否使用图片
      mulSpecPriceList: mulSpecPriceList.value // 多级规格的价格配置
    }
    return specDetials
  }

  const validSpec = async () => {
    if (isSpec.value === 1) { // 校验单级规格
      let idx = 1;
      const nameCache = []
      for (const item of singleSpecs.value) {
        let {name, price} = item
        name = name?.trim()
        price = price?.trim()
        if (!name && !price) {
          idx += 1;
          continue
        }
        if (price) {
          if (!name) return `第${idx}个规格请输入名称`
          if (!priceReg.test(price)) return `第${idx}个规格价格有误`
        }
        
        const tmp = nameCache.findIndex((cacheItem) => cacheItem === name)
        if (tmp > -1) return `第${idx}个规格名称重复`

        nameCache.push(name)
        idx += 1
      }
      if (nameCache.length === 0) return '请输入规格名称'
      for (const imgRef of uploadImgsRef.value){
        if (!imgRef) continue
        if (imgRef?.isLoading) return '请等待图片上传完成再保存～'
      }
    }
  }
  
  const saveHandle = async () => {
    const msg =  await validSpec()
    if (msg) return showToast(msg)
    const specDetials = getData()
    // 这里是清空多级规格的数据
    specDetials.mulSpecs = [];
    specDetials.mulUseImg = 0;
    specDetials.mulSpecPriceList  = [];
    const singleSpecs = []
    for (const item of specDetials.singleSpecs) {
      let name = item.name?.trim()
      let price  = item.price?.trim()
      if (!name) continue
      singleSpecs.push({...item, name, price})
    }
    specDetials.singleSpecs = singleSpecs
    const {min} = getSpecPrices(specDetials.singleSpecs)
    const payload = {
      specDetials: JSON.stringify(specDetials),
      price: min
    }
    await specManageInstance.saveHandle(payload, shopId)
    router.go(-1)
  }

  const cancelHandle = () => {
    specManageInstance.cancelHandle()
    router.go(-1)
  }

  const beforeDestory = async () => {
    specManageInstance.destory()
    setTimeout(() => {
      globalData.value.prodEditNeedAlive = false
    }, 300);
  }

  const modSingUseImg = async (val) => {
    if (!isVip(shopInfo.value)) {
      await showConfirmDialog({
        message: '开通会员后可使用图片功能。\n(注：会员99/年)',
        confirmButtonText: '前往开通',
        cancelButtonText: '好的'
      })
      toVip(shopId)
      return 
    }
    singleUseImg.value = val ? 1 : 0
  }
  
  const singleUseImgDisplay = computed({
    get(){
      if (singleUseImg.value === 1) return true
      return false
    },
    set(val) {
      modSingUseImg(val)
    }
  })

  const addBtnText = computed(() => {
    if (isSpec.value === 1) return '添加规格'
    if (isSpec.value === 2) return '添加规格分类'
  })

  const modMulName = async (idx) => {
    const matchedItem = mulSpecs.value[idx]
    const ret = await inputDialogRef.value.getVal(matchedItem.name, {title: '修改规格分类', validFn: (str) => {
      const tmpIdx = mulSpecs.value.findIndex((item) => item.name === str)
      if (tmpIdx !== idx && tmpIdx !== -1) {
        return '已存在该规格分类！'
      }
    }})
    
    matchedItem.name = ret
  }

  const addSubSpecHandle = async (idx) => {
    const matchedItem = mulSpecs.value[idx]
    const ret = await inputDialogRef.value.getVal('', {title: '添加规格', validFn: (str) => {
      if (/｜/.test(str)) return '不能包含特殊字符｜'
      for (const subItem of matchedItem.list) {
        if (subItem.name === str) {
          return '已存在该规格！'
        }
      }
    }})
    
    matchedItem.list.push({name: ret, url: '', id: getMulSpecIncId()})
  }

  const nextStepHandle = async () => {
    let idx = 0
    for (const item of mulSpecs.value) {
      idx += 1
      if (item.list.length === 0) {
        showToast(`第${idx}个分类请添加规格`)
        return
      }
      if (item.useImg === 1) {
        mulUseImg.value = 1
      }
    }
    if (mulSpecs.value.length === 0) {
      showToast('请先添加规格分类')
      return
    }
    const specDetials = getData()
    specManageInstance.updateSpecDetials(JSON.stringify(specDetials))
    globalData.value.specEditNeedAlive = true
    await sleep(200)
    router.push({name: 'mul-spec-price'})
  }

  const isShowMoveTop = (idx) => {
    if (idx === 0) return false
    return true
  }

  const moveTopHandle = (idx) => {
    const preIdx = idx - 1
    const preItem = singleSpecs.value[preIdx]
    singleSpecs.value[preIdx] = singleSpecs.value[idx]
    singleSpecs.value[idx] = preItem
  }

  const isShowMoveDown = (idx) => {
    const len = singleSpecs.value.length
    if (len === 1) return false
    if ((idx + 1) === len) return false
    return true
  }

  const moveDownHandle = (idx) => {
    const nextIdx = idx + 1
    const nextItem = singleSpecs.value[nextIdx]
    singleSpecs.value[nextIdx] = singleSpecs.value[idx]
    singleSpecs.value[idx] = nextItem
  }

  const isShowInsert = (idx) => {
    if (singleSpecs.value.length < 2) return false
    return true
  }

  const insertHandle = (idx) => {
    singleSpecs.value.splice(idx + 1, 0, getSingleDefault())
  }

  const isShowDel = (idx) => {
    if (singleSpecs.value.length < 2) return false
    return true
  }

  const delHandle = (idx) => {
    singleSpecs.value.splice(idx, 1)
  }

  const disabledAddBtn = computed(() => {
    if (isSpec.value === 1) {
      if (singleSpecs.value.length >= 20) return true
    }
    return false
  })

  const isShowMulMoveTop = (idx) => {
    if (idx === 0) return false
    return true
    
  }

  const  mulMoveTopHandle = (idx) => {
    const preIdx = idx - 1
    const preItem = mulSpecs.value[preIdx]
    mulSpecs.value[preIdx] = mulSpecs.value[idx]
    mulSpecs.value[idx] = preItem
  }

  const isShowMulMoveDown = (idx) => {
    const len = mulSpecs.value.length
    if (len === 1) return false
    if ((idx + 1) === len) return false
    return true
  }

  const mulMoveDownHandle = (idx) => {
    const nextIdx = idx + 1
    const nextItem = mulSpecs.value[nextIdx]
    mulSpecs.value[nextIdx] = mulSpecs.value[idx]
    mulSpecs.value[idx] = nextItem
  }

  const mulDelHandle = async (idx) => {
    const matchItem = mulSpecs.value[idx]
    await showConfirmDialog({
      message: `确定删除【${matchItem.name}】?`
    })
    mulSpecs.value.splice(idx, 1)
  }
  
  const specActionRef = ref()

  const subItemClickHandle = async (mulIdx, subIdx) => {
    const mulItem = mulSpecs.value[mulIdx]
    const subItem = mulItem.list[subIdx]
    const action = await specActionRef.value.getAction(subIdx, mulItem.list)
    if (action === 'edit') { // 修改 sub 规格
      const ret = await inputDialogRef.value.getVal(subItem.name, {title: '修改规格', validFn: (str) => {
        const tmpIdx = mulItem.list.findIndex((item) => item.name === str)
        if (tmpIdx > -1 && tmpIdx !== subIdx) {
          return '已存在该规格！'
        }
      }})
      subItem.name = ret
    }

    if (action === 'del')  { // 删除
      mulItem.list.splice(subIdx, 1)
    }
    if (action === 'moveTop') { // 上移
      const preIdx = subIdx - 1
      const preItem = mulItem.list[preIdx]
      mulItem.list[preIdx] = mulItem.list[subIdx]
      mulItem.list[subIdx] = preItem
    }
    if (action === 'moveDown') { // 后移
      const nextIdx = subIdx + 1
      const nextItem = mulItem.list[nextIdx]
      mulItem.list[nextIdx] = mulItem.list[subIdx]
      mulItem.list[subIdx] = nextItem
    }
  }

  const mulImgClickHandle = async (idx) => {
    if (!isVip(shopInfo.value)) {
      await showConfirmDialog({
        message: '开通会员后可使用图片功能。\n(注：会员99/年)',
        confirmButtonText: '前往开通',
        cancelButtonText: '好的'
      })
      toVip(shopId)
      return 
    }
    const matchedItem = mulSpecs.value[idx]
    if (matchedItem.useImg === 1) {
      matchedItem.useImg = 0
      return
    }
    for (const item of mulSpecs.value) {
      item.useImg = 0
    }
    matchedItem.useImg = 1
  }

  const imgModDialogRef = ref()
  const toEditImg = async (idx) => {
    const matchedItem = mulSpecs.value[idx]
    if (matchedItem.list.length === 0) {
      showToast('请先添加规格')
      return
    }
    const ret = await imgModDialogRef.value.getImgs(matchedItem)
    matchedItem.list = ret
  }

  const addHandle = (data) => {
    if (isSpec.value === 1) {
      const len = singleSpecs.value.length
      if (len === 0) return
      const tmpItem = singleSpecs.value[len - 1]
      if (!tmpItem) return
      if (!tmpItem.name) {
        tmpItem.name = data.name
      } else {
        const defaut = getSingleDefault()
        singleSpecs.value.push({...defaut, name : data.name})
      }
    }
    if (isSpec.value === 2) {
      const list = data.list.map((d) => {
        return {name: d, url: '', id: getMulSpecIncId()}
      })
      const obj = {
        name: data.name, useImg: 0, id: getMulSpecIncId(), list
      }
      mulSpecs.value.push(obj)
    }
  }
  
  
  const setExample = () => {
    let specsCfg = shopInfo.value.specsCfg || '{}'
    specsCfg = JSON.parse(specsCfg)
    if (isSpec.value === 1) {
      const singleCfg = specsCfg.singleCfg || []
      if (singleSpecs.value.length === 0) {
        if (singleCfg.length === 0) {
          singleSpecs.value = [
            {name: '大 (示例)', price: '', url: ''},
            {name: '小 (示例)', price: '', url: ''},
          ]
        } else {
          addSpecHandle()
        }
      }
    }
    if (isSpec.value === 2) {
      const mulCfg = specsCfg.mulCfg || []
      if (mulSpecs.value.length === 0 && mulCfg.length === 0) {
        mulSpecs.value = [
          {name: '颜色 (示例)', useImg: 0, id: getMulSpecIncId(), list: [
            {name: '黑', url: '', id: getMulSpecIncId()},
            {name: '白', url: '', id: getMulSpecIncId()},
          ]},
          {name: '尺码 (示例)', useImg: 0, id: getMulSpecIncId(), list: [
            {name: 'S', url: '', id: getMulSpecIncId()},
            {name: 'M', url: '', id: getMulSpecIncId()},
            {name: 'L', url: '', id: getMulSpecIncId()},
          ]},
        ]
      }
    }
  }
  
  const init = async () => {
    const info = await shopInfoManage.getData(shopId)
    shopInfo.value = info[0]
    const ret = specManageInstance.getRawData()
    isSpec.value = ret.isSpec
    const rawData = JSON.parse(ret.specDetials || '{}')
    singleSpecs.value = rawData.singleSpecs || []
    mulSpecs.value = rawData.mulSpecs || []
    singleUseImg.value = rawData.singleUseImg || 0
    mulUseImg.value = rawData.mulUseImg || 0
    mulSpecPriceList.value = rawData.mulSpecPriceList || []
    setExample() // 设置示例
  }

  return {
    singleSpecs, addSpecHandle, init, saveHandle, beforeDestory, singleUseImgDisplay, isSpec,
    addBtnText, inputDialogRef, mulSpecs, modMulName, addSubSpecHandle, nextStepHandle, isShowMoveTop,
    isShowMoveDown, isShowInsert, isShowDel, moveTopHandle, moveDownHandle, insertHandle, delHandle,
    cancelHandle, disabledAddBtn, uploadImgsRef, isShowMulMoveTop, isShowMulMoveDown, mulMoveTopHandle,
    mulMoveDownHandle, mulDelHandle, specActionRef, subItemClickHandle, mulImgClickHandle, toEditImg,
    imgModDialogRef, addHandle
  }
  
}