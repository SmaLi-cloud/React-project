import { authority } from './config';
import Storage from './Storage';
import { setAuthority } from './authority'

const permissions = JSON.parse(Storage.get("allPermissions"));

function findIndex(authority, value) {
  for (let j = 0; j < authority.length; j++) {
    if (authority[j] == value) {
      return j;
    }
  }
  return -1;
}

for (let i = 0; i < permissions.length; i++) {
  let permission = permissions[i];
  let permissionNode = permission.split('.'); // ["co", "user", "list"]
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
