import { post} from '@/http/http';

const pathName = 'serviceCgi'

export const getShop = (payload) => {
  return post(`/${pathName}/GetShop`, payload);
};

export const shopMod = (payload) => {
  return post(`/${pathName}/ShopMod`, payload);
};

export const productMod = (payload) => {
  return post(`/${pathName}/ProductMod`, payload)
}

export const moveTopProduct = (payload) => {
  return post(`/${pathName}/MoveTopProduct`, payload)
}

export const moveTopProductType = (payload) => {
  return post(`/${pathName}/MoveTopProductType`, payload)
}

export const productDel = (payload) => {
  return post(`/${pathName}/ProductDel`, payload)
}

export const getProduct = (...args) => {
  return post(`/${pathName}/GetProduct`, ...args);
};

export const countProduct = (payload) => {
  return post(`/${pathName}/CountProduct`, payload);
}

export const getProductTypes = (payload) => {
  return post(`/${pathName}/GetProductTypes`, payload);
};

export const productTypesMod = (payload) => {
  return post(`/${pathName}/ProductTypesMod`, payload)
}

export const productTypesDel = (payload) => {
  return post(`/${pathName}/ProductTypesDel`, payload)
}

export const getCosTempKeys = () => {
  return post(`/${pathName}/GetCosTempKeys`)
}