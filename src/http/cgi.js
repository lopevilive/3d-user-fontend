import { post} from '@/http/http';

const pathName = 'serviceCgi'

export const getShop = (payload) => {
  return post(`/${pathName}/GetShop`, payload);
};

export const shopMod = (payload) => {
  return post(`/${pathName}/ShopMod`, payload);
};

export const uploadFile = (file) => {
  const payload = new FormData()
  payload.append('file', file.file)
  const config = {
    headers: { //添加请求头
      'Content-Type': 'multipart/form-data'
    }
  }
  return post('/upload/', payload, config)
}

export const productMod = (payload) => {
  return post(`/${pathName}/ProductMod`, payload)
}

export const productDel = (payload) => {
  return post(`/${pathName}/ProductDel`, payload)
}

export const getProduct = (payload) => {
  return post(`/${pathName}/GetProduct`, payload);
};

export const getProductTypes = (payload) => {
  return post(`/${pathName}/GetProductTypes`, payload);
};

export const productTypesMod = (payload) => {
  return post(`/${pathName}/ProductTypesMod`, payload)
}

export const productTypesDel = (payload) => {
  return post(`/${pathName}/ProductTypesDel`, payload)
}