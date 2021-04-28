import { extend } from 'umi-request';

const request = extend({
  timeout: 5000,
});

export default request;
