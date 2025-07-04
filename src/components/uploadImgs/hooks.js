import {computed, ref} from 'vue'
import { uploadFile, shopInfoManage, watermarkManage, auditingImg } from '@/util'
import { useRoute } from 'vue-router'
import { showImagePreview} from 'vant'
import { globalData } from '@/store'

export const useUploadImages = (props, emits) => {
  const route = useRoute()
  const {shopId} = route.params

  const uploadings = ref([])

  const getWaterCfg = async () => {
    if (!shopId) return null
    if (props.noWatermark === 1) return null
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    if (shopInfo.waterMark === 1) {
      let ret = await watermarkManage.getData(shopId)
      if (ret.length) {
        ret = ret[0]
        const data = {
          type: ret.type,
          text: ret.text,
          ...JSON.parse(ret.cfg)
        }
        return data
      } else {
        return null
      }
    } else {
      return null
    }
  }
  
  const handleUpload = async (file) => {
    emits('start')
    const watermarkCfg = await getWaterCfg()
    try {
      uploadings.value.push(file)
      file.status = 'uploading'
      const uploadRet = await uploadFile(file.file, shopId, watermarkCfg, props.noJPG)
      const {Location: url, UploadResult: {OriginalInfo: {Key: fileName}}} = uploadRet
      const res = await auditingImg(fileName, shopId) // 等待审核
      if (res !== 0) throw new Error('系统繁忙，请重启小程序～')
      if (!url) return
      uploadings.value = uploadings.value.filter((item) => {
        if (item === file) return false
        return true
      })
      const uri = `//${url}`
      let list = props.modelValue.split(',')
      list.push(uri)
      list = [...new Set(list)]
      list = list.filter((item) => Boolean(item))
      emits('update:modelValue', list.join(','))
    } catch(e) {
      file.status = 'fail'
    }
  }
  
  const afterRead = (files) => {
    if (!Array.isArray(files)) files = [files]
    for (const file of files) {
      handleUpload(file)
    }
  }

  const deleteHandle = (file) => {
    const {url} = file
    let newVal = ''
    let list = props.modelValue.split(',')
    for (const item of list) {
      if (item === url) continue
      if (newVal) newVal += ','
      newVal += item
    }
    emits('update:modelValue', newVal)
  }

  const deleteUploading = (file) => {
    uploadings.value = uploadings.value.filter((item) => {
      if (item === file) return false
      return true
    })
  }

  const fileList = computed(() => {
    let ret = null
    if (!props.modelValue) {
      ret = []
    } else {
      ret = props.modelValue.split(',').map((url) => {
        return {url}
      })
    }
    if (uploadings.value.length) ret = [...ret, ...uploadings.value]
    return ret;
  })

  const onDrop = (params) => {
    const {removedIndex, addedIndex} = params
    if (removedIndex === undefined || addedIndex === undefined) return
    if (removedIndex === addedIndex) return
    const list = props.modelValue.split(',')
    if (removedIndex > addedIndex) {
      const removeItem = list[removedIndex]
      list.splice(addedIndex, 0, removeItem)
      list.splice(removedIndex + 1, 1)
    } else {
      const removeItem = list[removedIndex]
      list.splice(addedIndex + 1, 0, removeItem)
      list.splice(removedIndex, 1)
    }
    emits('update:modelValue', list.join(','))
  }

  const isShowUpload = computed(() => {
    const len = fileList.value.length
    if (len >= props.maxCount) return false
    return true
  })


  const overDialogRef = ref()
  const oversizeHandle = (file) => {
    overDialogRef.value.show(props.maxSize)
  }

  const viewHandle = (idx) => {
    if (globalData.value.isPC) return
    const list = fileList.value.map((item) => item.url)
    showImagePreview(list, idx)
  }

  const isLoading = computed(() => {
    for(const file of uploadings.value) {
      if (file.status === 'uploading') return true
    }
    return false
  })

  const maxC = computed(() => {
    let len = fileList?.value?.length || 0
    let count = (props.maxCount - len) || 0
    return count
  })

  const vanUploaderRef = ref()
  const chooseFile = () => {
    vanUploaderRef.value.chooseFile()
  }

  return {
    afterRead,
    deleteHandle,
    fileList,
    onDrop,
    uploadings,
    isShowUpload,
    oversizeHandle,
    viewHandle,
    deleteUploading,
    isLoading,
    maxC,
    vanUploaderRef,
    chooseFile,
    overDialogRef
  }
}