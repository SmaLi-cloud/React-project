import Cookies from 'js-cookie';

function get(key) {
  return sessionStorage ? sessionStorage.getItem(key) : Cookies.get(key);
}

function set(key, value) {
  return sessionStorage ? sessionStorage.setItem(key, value) : Cookies.set(key, value);
}

function remove(key) {
  return sessionStorage ? sessionStorage.removeItem(key) : Cookies.remove(key);
}
const Storage = {
  get,
  set,
  remove,
};
export default Storage;
