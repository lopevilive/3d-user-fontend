import axios from 'axios';
import { showNotify } from 'vant';

const http = axios.create({
  timeout: 1000 * 10,
  withCredentials: true,
  baseURL: '//xiaoguo.afxa.cn'
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
  const {data} = response;
  if (data.code !== 0) {
    if (data.code !== -2) {
      showNotify({message: data.msg || '未知出错，请联系管理员～', type: 'danger'});
    } 
    return Promise.reject(data);
  }
  return Promise.resolve(response.data);
};

const responseFailed = (error) => {
  if (error.code === 'ERR_CANCELED') return Promise.reject(error);
  showNotify({message: error.message || '未知出错，请联系管理员～', type: 'danger'});
  return Promise.reject(error);
};
http.interceptors.response.use(responseSuccess, responseFailed);

export const get = http.get
export const post = http.post