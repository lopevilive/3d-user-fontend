import { post} from '@/http/http';

const user = '/api/user/'

export const getUserInfo = (payload) => {
  return post(`${user}GetUserInfo`, payload);
}

export const setViewLogs = (payload) => {
  return post(`${user}SetViewLogs`, payload);
}

export const createBatchUploadToken = (payload) => {
  return post(`${user}CreateBatchUploadToken`, payload);
}

export const validBatchUploadToken = (payload) => {
  return post(`${user}ValidBatchUploadToken`, payload);
}