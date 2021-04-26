import config from './config';
import Storage from './Storage';
import { message } from 'antd';
import request from 'umi-request';

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
 * @param {"user:login"} action
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
    data: humpToLine(data),
    timeout: config.timeout,
    headers,
  };
  request(action, options)
    .then((result) => {
      console.log(result);
      message.success('🎉 🎉 🎉  登录成功！');

      // window.location.href = "http://localhost:8000/formList"
      if (action !== 'api/login/count' && !result.needLogin) {
        // const url = encodeURIComponent(window.location.href);
        // window.location.href ='/user/login?redirect='+url;
      }
      if (successCallback) {
        successCallback(lineToHump(result));
      }
    })
    .catch((err) => {
      logMsg(err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
}

function getChildPermissions(parentKey) {
  let allPermissions =[];
  if(Storage.get('allPermissions')){
    allPermissions = JSON.parse(Storage.get('allPermissions'));
  }
  if (!parentKey) {
    return allPermissions;
  }
  let childPermissions = [];
  for (let i = 0; i < allPermissions.length; i++) {
    if (allPermissions[i].startsWith(parentKey)) {
      childPermissions.push(allPermissions[i]);
    }
  }
  return childPermissions;
}

function checkUserPermission(permission) {
  let userPermissions = JSON.parse(Storage.get('userPermissions'));
  for (let i = 0; i < userPermissions.length; i++) {
    if (userPermissions[i] == permission) {
      return true;
    }
  }
  return false;
}

function logMsg(msg) {
  if (config.isDebug) {
    console.log(msg);
  }
}

function lineToHump(data) {
  if (data instanceof Array) {
    data.forEach((v) => lineToHump(v));
  } else if (data instanceof Object) {
    Object.keys(data).forEach(function (key) {
      let newKey = key.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
      if (newKey !== key) {
        data[newKey] = data[key];
        delete data[key];
      }
      lineToHump(data[newKey]);
    });
  }
  return data;
}

function humpToLine(data) {
  if (data instanceof Array) {
    data.forEach((v) => humpToLine(v));
  } else if (data instanceof Object) {
    Object.keys(data).forEach(function (key) {
      let newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (newKey !== key) {
        data[newKey] = data[key];
        delete data[key];
      }
      humpToLine(data[newKey]);
    });
  }
  return data;
}

function getUrlParams() {
  let url = window.location.search;
  let index = url.indexOf('?');
  let obj = {};
  if (index !== -1) {
    let str = url.substr(1);
    let arr = str.split('&');
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
  }
  return obj;
}

function getComponet(typeName) {
  for (var name in window) {
    if (name == typeName) {
      return window[name];
    }
  }
  return typeName;
}

export {
  getGuid,
  callAPI,
  logMsg,
  getUrlParams,
  getComponet,
  getChildPermissions,
  checkUserPermission,
};
