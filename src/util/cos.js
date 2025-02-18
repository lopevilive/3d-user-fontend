import COS from 'cos-js-sdk-v5';
import { getCosTempKeys } from '@/http'
import { showNotify } from 'vant';
import { md5File } from './util'
import { globalData } from '@/store'

const Bucket = 'upload-1259129443'
const Region = 'ap-guangzhou'


let keyData = null
const getKey = async () => {
  if (keyData) {
    let expired = (keyData.data.expiredTime - 60 * 5) * 1000 // 提前5分钟重新获取key
    if (Date.now() < expired) return keyData
  }
  keyData = await getCosTempKeys()
  return keyData
}


const getWatermarkRule = (data) => {
  const {type, batch, degree, dissolve, fill, fontsize, gravity, text, image} = data
  let ret = ''
  if (type === 2) { // 文字水印
    const textBase64 = COS.util.encodeBase64(text, true)
    const colorBase64 = COS.util.encodeBase64(fill, true)
    ret = `|watermark/${type}/text/${textBase64}/fill/${colorBase64}/fontsize/${fontsize}/dissolve/${dissolve}/gravity/${gravity}/dx/30/dy/30/degree/${degree}/spacing/30`
    if (batch) {
      ret += '/batch/1'
    }
  }
  if (type === 1) { // 图片水印
    const imgUrl = `http:${image}`
    // 经过安全base64编码 使用 COS.util.encodeBase64 方法需要sdk版本至少为1.4.19
    const imgUrlBase64 = COS.util.encodeBase64(imgUrl, true);
    ret = `watermark/1/image/${imgUrlBase64}/gravity/${gravity}/dissolve/${dissolve}/scatype/1/spcent/${fontsize *  10}`;
    if (batch) {
      ret += '/batch/1'
    }
  }
  return ret
}


export const cos = new COS({
  getAuthorization: async function (options, callback) {
    const {data} = await getKey()
    callback({
      TmpSecretId: data.credentials.tmpSecretId,
      TmpSecretKey: data.credentials.tmpSecretKey,
      SecurityToken: data.credentials.sessionToken,
      // 建议返回服务器时间作为签名的开始时间，避免客户端本地时间偏差过大导致签名错误
      StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
      ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
    });
  }
});

export const uploadFile = async (file, shopId, watermarkCfg) => {
  try {
    const {userId} = globalData.value.userInfo
    if (!userId) throw new Error('缺失用户信息')
    let fileNameRaw = await md5File(file)
    let pre = ''
    if (shopId) pre = String(shopId)
    if (pre) {
      pre = `${pre}_${userId}`
    } else {
      pre = `uid${userId}`
    }
    let fileName = `${pre}_${fileNameRaw}`

    let rule = 'imageMogr2/format/jpg'
    if (watermarkCfg) {
      let str = getWatermarkRule(watermarkCfg)
      rule += `|${str}`
      fileName = `${pre}_${Math.floor(Math.random() * 1000)}_${fileNameRaw}`
    }
    await getKey()
    const data = await cos.uploadFile({
      Bucket, // 填写自己的 bucket，必须字段
      Region,     // 存储桶所在地域，必须字段
      Key: fileName,            // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段
      Body: file, // 上传文件对象
      SliceSize: 1024 * 1024 * 20,  // 触发分块上传的阈值，超过5MB 使用分块上传，小于5MB使用简单上传。可自行设置，非必须
      onProgress: function(progressData) {
        console.log('上传进度：', progressData);
      },
      Headers: {
        'Pic-Operations': JSON.stringify({
          "is_pic_info": 1,
          "rules": [{
              "fileid": fileName,
              "rule": rule
              // "rule": "imageMogr2/quality/95/format/jpg"
          }]
        })
      }
    });
    return data
  } catch (e) {
    console.error('上传失败', e);
    showNotify({message: e?.message || e?.msg || '未知出错，请联系开发员～', type: 'danger'});
    throw(e)
  }

}

export const watermark = async (payload) => {
  const { fileid, configkey } = payload
  const waterMarkRule = getWatermarkRule(payload)
  const picOperations = JSON.stringify({
    is_pic_info: 1, // 固定
    // fileid 设置和Key相同可实现只保留处理后的图片而不保留原图
    // fileid 如果设置中文，需要经过URLEncode，比如 fileid: encodeURIComponent('图片.jpg')
    rules: [{ fileid, rule: waterMarkRule }],
  });
  let resolve;
  let reject;
  const p = new Promise((a, b) => {
    resolve = a;
    reject = b;
  })
  cos.request({
    Bucket, // Bucket 格式：test-1250000000，必填
    Region, // Bucket所在地域，比如ap-beijing，必填
    Key: configkey, // 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必填
    Method: 'POST', // 固定值
    Action: 'image_process', // 固定值
    Headers: {
      'Pic-Operations': picOperations,
    },
  },
  (e, data) => {
    if (e) {
      console.error(e, 'err')
      showNotify({message: e?.message || e?.msg || '未知出错，请联系开发员～', type: 'danger'});
      reject(err)
    } else {
      resolve(data)
    }
  })
  return p
}


