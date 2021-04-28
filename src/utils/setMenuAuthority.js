import config from './config';
import Storage from './Storage';
import { setAuthority } from './authority';
import * as Tools from '@/utils/Tools'

 const setMenuAuthority = () => {

  const checkUserPermission = (permission)=> {

    let userPermissions = JSON.parse(Storage.get('userPermissions'));
    
    if(!permissions) return false;
    for (let i = 0; i < userPermissions.length; i++) {
      if (userPermissions[i] == permission) {
        return true;
      }
    }
    return false;

  }
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
  if(!permissions) return;
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
export default setMenuAuthority;
