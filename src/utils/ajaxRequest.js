import request from '@/utils/request';
import getguid from '@/utils/guid';
import { getToken } from './auth';

request.interceptors.request.use((url, options) => {
  const headers = {
    guid: getguid(),
    // 'Content-Type': 'application/json',
    Accept: 'application/json',
    // userID 可以通过请求传递参数
    // Cookies.set('name', 'value', { expires: 7 })
  };
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    if (true) {
      headers.Authorization = `Bearer ${getToken()}`;
      // headers.Authorization = `Bearer hhddskjgjkjfggjhdhkfjk`;
    }
    return {
      url,
      options: { ...options, headers },
    };
  }
});

request.interceptors.response.use(async (response) => {
  // const data = await response.clone().json();
  const data = await response.clone();
  if (data) {
    // console.log('完成响应');
  }
  return response;
});

export default request;
