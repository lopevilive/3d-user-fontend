import COS from 'cos-js-sdk-v5';
import { getCosTempKeys } from '@/http'
import { showNotify } from 'vant';
import { md5File } from './util'


let keyData = null
const getKey = async () => {
  if (keyData) return keyData
  keyData = await getCosTempKeys()
  return keyData
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

export const uploadFile = async (file, shopId) => {
  if (!shopId) {
    shopId = 'none'
  }
  let fileName = await md5File(file)
  if (shopId) {
    fileName = `${shopId}_${fileName}`
  }
  try {
    await getKey()
    const data = await cos.uploadFile({
      Bucket: 'upload-1259129443', // 填写自己的 bucket，必须字段
      Region: 'ap-guangzhou',     // 存储桶所在地域，必须字段
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
              "rule": "imageMogr2/quality/100/format/jpg"
          }]
        })
      }
    });
    return data
  } catch (e) {
    console.error('上传失败', e.message);
    showNotify({message: e.message || '未知出错，请联系管理员～', type: 'danger'});
    throw(e)
  }

}


