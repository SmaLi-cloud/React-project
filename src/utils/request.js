import { extend } from 'umi-request';



 const request = extend({
  prefix: 'http://localhost:8000',//url
  timeout:5000,
  credentials: 'include' //cookie
});

export default request;


