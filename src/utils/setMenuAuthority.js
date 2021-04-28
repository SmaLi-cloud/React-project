import config from './config';
import Storage from './Storage';
// import { setAuthority } from './authority';
import * as Tools from '@/utils/Tools';
import RenderAuthorize from '@/components/Authorized';

const getAuthority = (str) => {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  if (!authority) {
    return ['admin'];
  }
  return authority;
};

let Authorized = RenderAuthorize(getAuthority());

const reloadAuthorized = () => {
  Authorized = RenderAuthorize(getAuthority());
};

window.reloadAuthorized = reloadAuthorized;

const setMenuAuthority = () => {
  const setAuthority = (authority) => {
    const proAuthority = typeof authority === 'string' ? [authority] : authority;
    localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload
    reloadAuthorized();
  };
  const checkUserPermission = (permission) => {
    let userPermissions = JSON.parse(Storage.get('userPermissions'));
    if (!permissions) return false;
    for (let i = 0; i < userPermissions.length; i++) {
      if (userPermissions[i] == permission) {
        return true;
      }
    }
    return false;
  };
  function findIndex(authority, value) {
    for (let index = 0; index < authority.length; index++) {
      if (authority[index] == value) {
        return index;
      }
    }
    return -1;
  }
  const authority = config.authority;
  const permissions = JSON.parse(Storage.get('allPermissions'));
  if (!permissions) return;
  for (let i = 0; i < permissions.length; i++) {
    let permission = permissions[i];
    let permissionNode = permission.split('.'); // ["co", "user", "list"]
    Tools.logMsg(permissionNode);
    if (permissionNode.length <= 2) {
      if (checkUserPermission(permission)) {
        continue;
      } else {
        const index = findIndex(authority, permissions[i]);
        if (index >= 0) {
          authority.splice(index, 1);
        }
      }
    }
  }
  Tools.logMsg(authority);
  setAuthority(authority);
};
export { Authorized };

export default setMenuAuthority;
