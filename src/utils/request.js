import request, { extend } from 'umi-request';

import getGuid from '@/utils/Tools';
import { getToken } from './Storage';



const Handler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {

  }

  return response;
};

request.interceptors.request.use((url, options) => {

  return {
    url,
    options: { ...options, headers },
  };
});

request.interceptors.response.use(async (response) => {
  if (response.need_login) {
    // console.log('完成响应');
    return data;
  }
  return response;
});
const extendRequest = extend({ errorHandler });

 const errorhandler = extend({
  prefix: 'http://localhost:8000',//url
  Handler,
  timeout:5000,
  credentials: 'include' //cookie
});

export default request;


