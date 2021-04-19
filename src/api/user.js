import request from '@/utils/request'

const api = {
  GetValidationCode: '/user/getValidateCode',
  GetMessageCode: '/user/getMessageCode',
  Login: '/user/login',
  Logout: '/user/logout',
  UserFund: '/userFund/list',
  Info: '/product/info',
  Navs: '/product/navs',
  payList: '/userQuery/getPayment',
  tradeList: '/userQuery/getTradingLog',
};

export function getValidationCode() {
  return request({
    url: api.GetValidationCode,
    method: 'get',
    hideloading: true
  })
}
export function getMessageCode(data) {
  return request({
    url: api.GetMessageCode,
    method: 'post',
    data,
    hideloading: true
  })
}


export function login(data) {
  return request({
    url: api.Login,
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: api.Logout,
    method: 'get',
    hideloading: true
  })
}


export function getProductInfo(params) {
  return request({
    url: api.Info,
    method: 'get',
    params,
  })
}

export function getFundNavList(params) {
  return request({
    url: api.Navs,
    method: 'get',
    params,
  })
}

export function getUserHoldList() {
  return request({
    url: api.UserFund,
    method: 'get',
  })
}

export function getUserPaymentList(params) {
  return request({
    url: api.payList,
    method: 'get',
    params,
  })
}

export function getUserTradeList(params) {
  return request({
    url: api.tradeList,
    method: 'get',
    params,
  })
}
