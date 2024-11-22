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

export const getAttrs = (payload) => {
  return post(`${album}GetAttrs`, payload)
}