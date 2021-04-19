import config from "./config";
import Storage from "./Storage";
import request from "umi-request"

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
 * @param {"api/login"} action 
 * @param { Object,Array } data 
 */
function callAPI(action, data, successCallback, errorCallback) {
  const token = Storage.get('VO_TOKEN');
  const headers = {
    'Request-Unid': getGuid(),
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Vo-Token': token,
  };
  const options = {
    prefix: config.prefix,
    method: 'POST',
    data: toLine(data),
    timeout: config.timeout,
    headers,
  }
  request(action, options).then(result => {
    if(action !== "api/login/count" && !result.needLogin){
      const url = window.location.href;
      // window.location.href ='/user/login?redirect='+url;
    }
    if(successCallback) {
      successCallback(toHump(result))
    }
  }).catch(err => {
    logMsg(err)
    if(errorCallback){
      errorCallback(err)
    }
  })
}

function logMsg(msg){
  if(config.isDebug) {
    console.log(msg);
  }
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
  logMsg
};
