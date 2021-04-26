import config from './config';
import Storage from './Storage';
import { setAuthority } from './authority';

function findIndex(authority, value) {
  for (let index = 0; index < authority.length; index++) {
    if (authority[index] == value) {
      return index;
    }
  }
  return -1;
}

function checkUserPermission(permission) {
  let userPermissions = JSON.parse(localStorage.getItem('userPermissions'));
  if(!permissions) return false;
  for (let i = 0; i < userPermissions.length; i++) {
    if (userPermissions[i] == permission) {
      return true;
    }
  }
  return false;
}

export const setMenuAuthority = () => {
  const authority = config.authority;

  const permissions = JSON.parse(Storage.get('allPermissions'));
  if(!permissions) return;
  for (let i = 0; i < permissions.length; i++) {
    let permission = permissions[i];
    let permissionNode = permission.split('.'); // ["co", "user", "list"]
    console.log(permissionNode);
    if (permissionNode.length <= 2) {
      if (checkUserPermission(permissions[i])) {
        continue;
      } else {
        const index = findIndex(authority, permissions[i]);
        if (index >= 0) {
          authority.splice(index, 1);
        }
      }
    }
  }
  setAuthority(authority);
};
