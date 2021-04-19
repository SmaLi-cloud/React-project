import { timeout, prefix } from "config";
import { getToken } from "./Storage";
import { notification } from 'antd';

/**
 * 随机码GUID
 * @returns "d8b591ff-193d-4f21-aa29-42fba170cb25"
 */
function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @param {"/login"} action 
 * @param {Object} data 
 * @param {*} successCallback 
 * @param {*} errorCallback 
 */
function callAPI(action, data, successCallback, errorCallback) {
  const token = getToken();
  const headers = {
    'Request-Unid': getGuid(),
    Accept: 'application/json',
    'Vo-Token': token,
  };
  const options = {
    prefix,
    method: 'POST',
    data: toLine(data),
    timeout,
    headers,
  }
  request(action, options).then(result => {
    if(!result.need_login){
      window.location.href ='/login';
    }
    successCallback(result)
  }).catch(err => {
    errorCallback(err)
  })
}

function successCallback(result) {
 const { data } = toHump(result)
}
function errorCallback(error) {
  const { message } = error.response;
  notification.error({
    message,
  });
}

/**
 * @param {Array, Object}
 * @returns Line to Hump
 */
function toHump(data) {
  if (data instanceof Array) {
      data.forEach(v => toHump(v))
  } else if (data instanceof Object) {
      Object.keys(data).forEach(function (key) {
          let newKey = key.replace(/_(\w)/g, (all, letter)=>  letter.toUpperCase())
          if (newKey !== key) {
              data[newKey] = data[key]
              delete data[key]
          }
          toHump(data[newKey])
      })
  }
  return data;
}

/**
 * @param {Array, Object} 
 * @returns Hump to Line
 */
function toLine(data) {
  if (data instanceof Array) {
      data.forEach(v => toLine(v))
  } else if (data instanceof Object) {
      Object.keys(data).forEach(function (key) {
          let newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
          if (newKey !== key) {
              data[newKey] = data[key]
              delete data[key]
          }
          toLine(data[newKey])
      })
  }
  return data;
}
export {
  getGuid,
  callAPI,
};
