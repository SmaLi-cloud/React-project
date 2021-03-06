import config from './config';
import Storage from './storage';
import { parse } from 'querystring';
import request from 'umi-request';
import { stringify } from 'querystring';
import { Modal } from 'antd';
import lodash from 'lodash';

let eventList = [];
let verifys = {};
let verifyMsg = [];

/**
 * 随机码GUID
 * @returns "d8b591ff-193d-4f21-aa29-42fba170cb25"
 */
function getGuid() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * @param {"user:login"} action
 * @param { Object,Array } data
 */
function callAPI(action, data, successCallback, errorCallback, noMask) {
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
    data: humpToLine(JSON.parse(JSON.stringify(data))),
    timeout: config.timeout,
    headers: headers,
    mode: 'cors',
  };
  if (noMask !== true) {
    sendEvent('setMaskState', true);
  }
  request(config.prefix, options)
    .then((result) => {
      result = lineToHump(result);
      sendEvent('setMaskState', false);
      if (result.needLogin) {
        showMessage('登录失效', '您当前的登录已失效，请重新登录！', 'error', () => {
          let queryString = stringify({
            redirect: window.location.href,
          });
          if (queryString) {
            window.location.href = '/user/login?' + queryString;
          } else {
            window.location.href = '/user/login';
          }
        });
      }
      if (successCallback) {
        successCallback(result);
      }
    })
    .catch((err) => {
      sendEvent('setMaskState', false);
      logMsg(err);
      if (errorCallback) {
        errorCallback(err);
      }
    });
}

function addListener(event, uniKey, callback) {
  if (!eventList[event]) {
    eventList[event] = [];
  }
  for (var i = 0; i < eventList[event].length; i++) {
    if (eventList[event][i].uniKey == uniKey) {
      eventList[event][i].callback = callback;
      return;
    }
  }
  eventList[event].push({ callback: callback, uniKey: uniKey });
}

function sendEvent(event, param) {
  if (!eventList[event]) {
    return;
  }
  for (var i = 0; i < eventList[event].length; i++) {
    if (eventList[event][i].callback) {
      eventList[event][i].callback(param);
    }
  }
}

function clearListener(event) {
  if (!eventList[event]) {
    return;
  }
  delete eventList[event];
}

function removeListener(event, uniKey) {
  if (!eventList[event]) {
    return;
  }
  for (var i = 0; i < eventList[event].length; i++) {
    if (eventList[event][i].uniKey == uniKey) {
      eventList[event].splice(i, 1);
    }
  }
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

function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

const getPageQuery = () => parse(window.location.href.split('?')[1]);

function getVerifyRule(rouleName, callback) {
  if (verifys[rouleName]) {
    callback(verifys[rouleName]);
    return;
  }
  callAPI('sys.verify:get_rule', { rouleName: rouleName }, (result) => {
    if (result.success) {
      verifys[rouleName] = result.data;
      callback(verifys[rouleName]);
    }
  });
}

function verify(rouleName, data, callback) {
  getVerifyRule(rouleName, function (verifyRules) {
    verifyMsg = [];
    var checkFlag = true;
    for (var key in verifyRules) {
      var result = verifyItem(key, verifyRules[key], data);
      if (checkFlag) {
        checkFlag = result;
      }
    }
    callback(checkFlag, verifyMsg);
  });
}

function verifyItem(key, verifyRule, data) {
  if (!verifyRule.verifications) {
    return true;
  }
  if (verifyRule.clientCondition) {
    if (!eval(verifyRule.clientCondition)) {
      return true;
    }
  }
  if (!data.hasOwnProperty(key)) {
    data[key] = '';
  }
  var inputValue = data[key];
  if (verifyRule.allowEmpty && inputValue == '') {
    return true;
  }
  for (var i = 0; i < verifyRule.verifications.length; i++) {
    let verification = verifyRule.verifications[i];
    if (verification.type === 'empty') {
      if (inputValue === '' || (inputValue instanceof Array && inputValue.length == 0)) {
        if (verification.errMsg) {
          verifyMsg.push(verification.errMsg);
          return false;
        }
      }
    } else if (verification.type === 'length') {
      if (verification.value) {
        if (inputValue.length !== parseInt(verification.value, 10)) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'min_length') {
      if (verification.value) {
        if (inputValue.length < parseInt(verification.value, 10)) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'max_length') {
      if (verification.value) {
        if (inputValue.length > parseInt(verification.value, 10)) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'regexp') {
      if (verification.value) {
        let reg = new RegExp(verification.value);
        if (!reg.test(inputValue)) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'function') {
      if (verification.value) {
        if (!eval(verification.value + '(data);')) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'equal') {
      if (verification.value) {
        if (inputValue !== data[verification.value]) {
          if (verification.errMsg) {
            verifyMsg.push(verification.errMsg);
            return false;
          }
        }
      }
    } else if (verification.type === 'mail') {
      var regMail = /^(([A-Za-z0-9\-]+_+)|([A-Za-z0-9\-]+\-+)|([A-Za-z0-9\-]+\.+)|([A-Za-z0-9\-]+\++))*[A-Za-z0-9_\-]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/;
      if (!regMail.test(inputValue)) {
        if (verification.errMsg) {
          verifyMsg.push(verification.errMsg);
          return false;
        }
      }
    } else if (verification.type === 'date') {
      var regDatetime = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2]\d|3[0-1])$/;
      if (!regDatetime.test(inputValue)) {
        if (verification.errMsg) {
          verifyMsg.push(verification.errMsg);
          return false;
        }
      }
    } else if (verification.type === 'number') {
      var regNumber = /^(-?[1-9][0-9]*|0)$/;
      if (!regNumber.test(inputValue)) {
        if (verification.errMsg) {
          verifyMsg.push(verification.errMsg);
          return false;
        }
      }
    } else if (verification.type === 'float') {
      var regFloat = /^-?[0-9]+.?[0-9]*$/;
      if (!regFloat.test(inputValue)) {
        if (verification.errMsg) {
          verifyMsg.push(verification.errMsg);
          return false;
        }
      }
    }
  }
  return true;
}

function showMessage(title, messages, type, callback) {
  if (typeof messages == 'undefined') {
    messages = 'undefined';
  }
  if (!(messages instanceof Array)) {
    messages = messages.split('\n');
  }
  let children = [];
  messages.forEach((message, i) => {
    children.push(<div key={i}>{message}</div>);
  });
  if (!type) {
    Modal.error({
      title: title,
      content: <div>{children}</div>,
      onOk: callback,
    });
  } else {
    Modal[type]({
      title: title,
      content: <div>{children}</div>,
      onOk: callback,
    });
  }
}
function cloneDeep(data) {
  return lodash.cloneDeep(data);
}
function getTreeChild(oldPermissionCodes, oldPermissions) {
  let permissionCodes = cloneDeep(oldPermissionCodes);
  let permissions = cloneDeep(oldPermissions);
  for (let i = 0; i < permissionCodes.length; i++) {
    const code = permissionCodes[i];
    for (let j = i + 1; j < permissionCodes.length; j++) {
      const codeCompare = permissionCodes[j];
      if (code.length < codeCompare.length && codeCompare.startsWith(permissionCodes[i])) {
        permissions.splice(i, 1);
        break;
      }
    }
  }
  return permissions;
}

function arrUnique(arr, key) {
  let returnArr = [];
  if (key) {
    const obj = {};
    returnArr = arr.reduce((cur, next) => {
      obj[next[key]] ? '' : (obj[next[key]] = true && cur.push(next));
      return cur;
    }, []);
    return returnArr;
  }
  returnArr = arr.reduce((cur, next) => {
    !cur.includes(next) && cur.push(next);
    return cur;
  }, []);
  return returnArr;
}
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
  formatNumber,
  addListener,
  sendEvent,
  clearListener,
  removeListener,
  verify,
  showMessage,
  cloneDeep,
  getTreeChild,
  arrUnique,
};
