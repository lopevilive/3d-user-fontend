import { post} from '@/http/http';

const album = '/api/album/'

export const getShop = (payload) => {
  return post(`${album}GetShop`, payload);
};

export const shopCreate = (payload) => {
  return post(`${album}ShopCreate`, payload);
};

export const shopMod = (payload) => {
  return post(`${album}ShopMod`, payload);
};

export const productMod = (payload) => {
  return post(`${album}ProductMod`, payload)
}

export const moveTopProduct = (payload) => {
  return post(`${album}MoveTopProduct`, payload)
}

export const productDel = (payload) => {
  return post(`${album}ProductDel`, payload)
}

export const modProdTypesSort = (payload) => {
  return post(`${album}ModProdTypesSort`, payload)
}

export const getProduct = (...args) => {
  return post(`${album}GetProduct`, ...args);
};

export const countProduct = (payload) => {
  return post(`${album}CountProduct`, payload);
}

export const getProductTypes = (payload) => {
  return post(`${album}GetProductTypes`, payload);
};

export const productTypesMod = (payload) => {
  return post(`${album}ProductTypesMod`, payload)
}

export const productTypesDel = (payload) => {
  return post(`${album}ProductTypesDel`, payload)
}

export const getCosTempKeys = () => {
  return post(`${album}GetCosTempKeys`)
}

export const getStaff = (payload) => {
  return post(`${album}GetStaff`, payload)
}

export const createStaff = (payload) => {
  return post(`${album}CreateStaff`, payload)
}

export const delStaff = (payload) => {
  return post(`${album}DelStaff`, payload)
}

export const verfiyStaff = (payload) => {
  return post(`${album}VerfiyStaff`, payload)
}

export const acceptStaff = (payload) => {
  return post(`${album}AcceptStaff`, payload)
}

export const getAllShop = (payload) => {
  return post(`${album}GetAllShop`, payload)
}

export const getAddressList = () => {
  return post(`${album}GetAddressList`)
}

export const addressMod = (payload) => {
  return post(`${album}AddressMod`, payload)
}

export const addressDel = (payload) => {
  return post(`${album}AddressDel`, payload)
}

export const getInventory = (payload) => {
  return post(`${album}GetInventory`, payload)
}

export const createInventory = (payload) => {
  return post(`${album}CreateInventory`, payload)
}

export const modShopStatus = (payload) => {
  return post(`${album}ModShopStatus`, payload)
}

export const encryAlbum = (payload) => {
  return post(`${album}EncryAlbum`, payload)
}

export const getEncryCode = (payload) => {
  return post(`${album}GetEncryCode`, payload)
}

export const updateEncryCode = (payload) => {
  return post(`${album}UpdateEncryCode`, payload)
}

export const valiEncryCode = (payload) => {
  return post(`${album}ValiEncryCode`, payload)
}

export const createFeedback = (payload) => {
  return post(`${album}CreateFeedback`, payload)
}

export const getWatermarkCfg = (payload) => {
  return post(`${album}GetWatermarkCfg`, payload)
}

export const saveWatermarkCfg = (payload) => {
  return post(`${album}SaveWatermarkCfg`, payload)
}

export const auditingImgCgi = (payload) => {
  return post(`${album}AuditingImg`, payload)
}

export const getCusInventory = (payload) => {
  return post(`${album}GetCusInventory`, payload)
}

export const modInventoryStatus = (payload) => {
  return post(`${album}ModInventoryStatus`, payload)
}

export const modProductPos = (payload) => {
  return post(`${album}ModProductPos`, payload)
}

export const getVipInfo = (payload) => {
  return post(`${album}GetVipInfo`, payload)
}
