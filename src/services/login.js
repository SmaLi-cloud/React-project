import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return 
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
