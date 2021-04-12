import request from '@/utils/request';
import Cookie from 'js-cookie';
import getguid from '@/utils/guid';
import { getToken } from './auth';

request.interceptors.request.use((url, options) => {
  const headers = {
    guid: getguid(),
    // 'Content-Type': 'application/json',
    // Accept: 'application/json',
    // userID  cookie
    // Cookies.set('name', 'value', { expires: 7 })
  };
  if (
    options.method === 'post' ||
    options.method === 'put' ||
    options.method === 'delete' ||
    options.method === 'get'
  ) {
    if (getToken()) {
      requestData.Authorization = `Bearer ${getToken()}`;
    }
    return {
      url,
      options: { ...options, headers },
    };
  }
});

// request.interceptors.response.use(async (response) => {
//   const data = await response.clone().json();
//   if (data && data.need_login) {
//     // console.log('完成响应');
//   }
//   return response;
// });

export default request;
