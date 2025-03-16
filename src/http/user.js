import { post} from '@/http/http';

const user = '/api/user/'

export const getUserInfo = () => {
  return post(`${user}GetUserInfo`);
}

export const setViewLogs = (payload) => {
  return post(`${user}SetViewLogs`, payload);
}