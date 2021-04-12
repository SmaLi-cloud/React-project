import Cookies from 'js-cookie'
const timeKey = 'react-timestamp-key'
const TokenKey = 'react-lbms-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token,{ expires: 1 })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTimeStamp() {
  return Cookies.get(timeKey)
}

export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
