import { auditingImgCgi } from '@/http'
import { shopInfoManage } from '@/util'


export const auditingImg = async (fileName, shopId) => {
  let ret 
  if (!shopId) {
    ret = await auditingImgCgi({fileName})
  } else {
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    if (shopInfo.auditing === 99) return 0 // 不用审核
    ret = await auditingImgCgi({fileName, shopId})
  }
  return ret.data
} 