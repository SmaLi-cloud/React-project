import Cookies from 'js-cookie';

const hasSession = typeof window.location.sessionStorage == 'undefined' ? true : false;
function get(key) {
  return hasSession ? sessionStorage.getItem(key) : Cookies.get(key);
}

function set(key, value) {
  return hasSession ? sessionStorage.setItem(key, value) : Cookies.set(key, value);
}

function remove(key) {
  if (hasSession) {
    return sessionStorage.removeItem(key);
  }
  return Cookies.remove(key);
}
const Storage = {
  get,
  set,
  remove,
};
export default Storage;
