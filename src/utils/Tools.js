import config from './config';
import Storage from './Storage';
import { parse } from 'querystring';
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
  const token = Storage.get('voToken');
  let headers = {
    'Request-Unid': getGuid(),
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Vo-Token'] = token;
  }
  data['action'] = action;
  const options = {
    method: 'POST',
    data: humpToLine(data),
    timeout: config.timeout,
    headers: headers,
    mode: 'cors',
  };
  request(config.prefix, options)
    .then((result) => {
      console.log(result);
      const { success } = result;

      // window.location.href = "http://localhost:8000/formList"
      // if (action !== 'api/login/count' && !result.needLogin) {
      // const url = encodeURIComponent(window.location.href);
      // window.location.href ='/user/login?redirect='+url;
      // }
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
  let allPermissions = [];
  if (Storage.get('allPermissions')) {
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
  let allPermissions = [];
  if (Storage.get('allPermissions')) {
    allPermissions = JSON.parse(Storage.get('allPermissions'));
  }
  for (let i = 0; i < allPermissions.length; i++) {
    if (allPermissions[i] == permission) {
      let userPermissions = JSON.parse(Storage.get('userPermissions'));
      for (let i = 0; i < userPermissions.length; i++) {
        if (userPermissions[i] == permission) {
          return true;
        }
      }
      return false;
    }
  }
  return true;
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

function buildTree(data, key_filed, parent_filed, child_filed, parent_id) {
  let tree = [];
  for (let i = 0; i < data.length; i++) {
    data[i]['title'] = data[i]['name'];
    data[i]['value'] = data[i]['id'];
    if (data[i][parent_filed] == parent_id) {
      let childrens = buildTree(data, key_filed, parent_filed, child_filed, data[i][key_filed]);
      if (childrens.length) {
        data[i][child_filed] = childrens;
      }
      tree.push(data[i]);
    }
  }
  return tree;
}

function getTreeParent(tree, child_filed, parent_id, key_filed, child_id) {
  let parents = [];
  for (let i = 0; i < tree.length; i++) {
    if (tree[i][child_filed]) {
      let child_parents = getTreeParent(
        tree[i][child_filed],
        child_filed,
        parent_id,
        key_filed,
        child_id,
      );
      if (child_parents !== false) {
        parents.push(tree[i][key_filed]);
        for (let j = 0; j < child_parents.length; j++) {
          parents.push(child_parents[j]);
        }
        return parents;
      }
    } else {
      if (tree[i][key_filed] == child_id) {
        if (!tree[i][parent_id]) {
          return false;
        }
        return parents;
      }
    }
  }
  return false;
}

const getPageQuery = () => parse(window.location.href.split('?')[1]);

export {
  getGuid,
  callAPI,
  logMsg,
  getUrlParams,
  getComponet,
  getChildPermissions,
  checkUserPermission,
  getPageQuery,
  buildTree,
  getTreeParent,
};
