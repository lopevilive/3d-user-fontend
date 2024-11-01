import { post} from '@/http/http';

const album = '/api/album/'

export const getShop = (payload) => {
  return post(`${album}GetShop`, payload);
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

export const moveTopProductType = (payload) => {
  return post(`${album}MoveTopProductType`, payload)
}

export const productDel = (payload) => {
  return post(`${album}ProductDel`, payload)
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