import { post} from '@/http/http';

const user = '/api/user/'

export const getUserInfo = () => {
  return post(`${user}GetUserInfo`);
}