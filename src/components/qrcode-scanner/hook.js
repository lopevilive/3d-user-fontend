import { ref, nextTick} from 'vue'
import {Html5Qrcode} from "html5-qrcode";
import { showFailToast } from 'vant'


export const useQrcodeScanner = (emits) => {
  let instance = null
  const status = ref(0) // 0-未开启、1-loading、2-就绪

  const onScanSucc = async (decodedText) => {
    if (status.value === 1) {
      status.value = 2
    }
    emits('scan', decodedText)
  }

  const onScanFail = async () => {
    if (status.value === 1) {
      status.value = 2
    }
  }

  const createInstance = () => {
    instance = new Html5Qrcode('scanner-reader')
  }


  const start = async () => {
    await Html5Qrcode.getCameras()
    status.value = 1
    await nextTick()
    createInstance()
    await instance.start(
      {facingMode: 'environment'},
      {fps: 10, qrbox: { width: window.innerWidth / 2, height: window.innerWidth / 2 }},
      onScanSucc,
      onScanFail
    );
  }

  const close = async () => {
    try {
      if (instance.isScanning) {
        await instance.stop()
      }
    } finally {
      setTimeout(() => {
        status.value = 0
        instance = null
      }, 0);
      instance.clear()
    }
  }

  const uploaderRef = ref()
  const selectImg = () => {
    uploaderRef.value.chooseFile()
  }

  const actions = [
    {name:'扫描二维码', exec: start},
    {name: '选择二维码图片', exec: selectImg}
  ]

  const isShowAction = ref(false)
  const actionHandle = (actionItem) => {
    isShowAction.value = false
    const {exec} = actionItem
    if (exec) exec()
  }

  const show = () => {
    isShowAction.value = true
  }

  const afterRead = async ({file}) => {
    status.value = 1
    await nextTick()
    createInstance()
    try {
      const decodedText = await instance.scanFile(file, false)
      emits('scan', decodedText)
    } catch(e) {
      showFailToast('未识别到二维码～')
    } finally {
      close()
    }
  } 

  return {
    start,
    status,
    close,
    actionHandle,
    isShowAction,
    actions,
    show,
    uploaderRef,
    afterRead
  }
}