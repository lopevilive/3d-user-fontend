import { auditingImgCgi } from '@/http'
import { shopInfoManage } from '@/util'


export const auditingImg = async (fileName, shopId) => {
  if (!shopId) {
    await auditingImgCgi({fileName})
  } else {
    let shopInfo = await shopInfoManage.getData(shopId)
    shopInfo = shopInfo[0]
    if (shopInfo.auditing === 99) return
    await auditingImgCgi({fileName, shopId})
  }
} 