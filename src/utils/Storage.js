import Cookies from 'js-cookie'
const TokenKey = 'react-lbms-token'
const hasSession = typeof window.localStorage == 'undefined' ? true: false
export function getToken() {
  return hasSession ? localStorage.getItem(TokenKey) : Cookies.get(TokenKey)
}

export function setToken(token) {
  return hasSession ? localStorage.setItem(TokenKey, token) : Cookies.set(TokenKey, token,{ expires: 1 })
}

export function removeToken() {
  if(hasSession){
    return localStorage.removeItem(TokenKey)
  }
  return Cookies.remove(TokenKey)
}
