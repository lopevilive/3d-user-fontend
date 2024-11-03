import { post} from '@/http/http';

const user = '/api/user/'

// todo 此处在微信小程序调用获取token
export const login = (payload) => {
  return post(`${user}Login`, payload);
}

export const getUserInfo = () => {
  return post(`${user}GetUserInfo`);
}