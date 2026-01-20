import { post} from '@/http/http';

const user = '/api/user/'

export const getUserInfo = (payload) => {
  return post(`${user}GetUserInfo`, payload);
}

export const setViewLogs = (payload) => {
  return post(`${user}SetViewLogs`, payload);
}