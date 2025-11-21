import axios from 'axios';
import { showNotify } from 'vant';
import router from '@/router'
import { toLogin } from '@/util'

const http = axios.create({
  timeout: 1000 * 10,
  withCredentials: true,
  baseURL: `//${location.host}`
});

// 请求拦截器
const beforeRequest = (config) => {
  // 设置 token
  const token = localStorage.getItem('token');
  token && (config.headers.Authorization = token);
  return config;
};

http.interceptors.request.use(beforeRequest);

// 响应拦截器
const responseSuccess = (response) => {
  const {data, config: {url}} = response;
  if (data.code === 0) {
    return Promise.resolve(data);
  }
  if (data.code === -2) { // 登录有误
    const fullPath = router?.currentRoute?.value?.fullPath || '/'
    if (!/GetUserInfo/.test(url)) {
      toLogin(fullPath)
    }
    return Promise.reject(data);
  }
  if (/Report/.test(url)) return Promise.reject(data); // 上报出错不提示
  showNotify({message: data.msg || '未知出错，请联系开发员～', type: 'danger'});
  return Promise.reject(data);
};

const responseFailed = (error) => {
  if (error.code === 'ERR_CANCELED') return Promise.reject(error);
  console.error(error)
  // showNotify({message: error?.message || error?.msg || '借口请求报错，请联系开发员~', type: 'danger'});
  return Promise.reject(error);
};
http.interceptors.response.use(responseSuccess, responseFailed);

export const get = http.get
export const post = http.post