/*
 * @Author: monster
 * @Date: 2020-12-09 11:24:48
 * @LastEditors: monster
 * @LastEditTime: 2020-12-09 11:28:43
 */
export const VUE_APP_NODE_ENV = process.env.VUE_APP_NODE_ENV
export const isDev = VUE_APP_NODE_ENV === 'dev'
export const isProd = VUE_APP_NODE_ENV === 'prod'

// 中台API
const BASE_DOMAIN = 'public-api.jjh9999.com/bm-base'
export const BASE_URL = isProd
  ? `https://${BASE_DOMAIN}`
  : `https://${VUE_APP_NODE_ENV}-${BASE_DOMAIN}`
export const SOCKET_URL = 'wss://stws.jjh9999.com'

// 业务API-DOMAIN
const API_DOMAIN_BASE = 'hg-api.huangjinx.com'
const API_DOMAIN = isProd
  ? API_DOMAIN_BASE
  : `${VUE_APP_NODE_ENV}-${API_DOMAIN_BASE}`
// 业务API地址
export const API_URL = `https://${API_DOMAIN}/gm-itrade`
// socket地址
export const SOCKET_URL_BUSINESS = `wss://${API_DOMAIN}/websocket`
// 行情数据源socket地址
export const SOCKET_URL_PEICR = 'wss://stws.jjh9999.com/'
export const SOCKET_TOKEN = 'junit:test'
