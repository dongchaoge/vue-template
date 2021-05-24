const ENV = process.env.VUE_APP_NODE_ENV
const __PROD__ = ENV === 'prod'
// console.log('ENVENV', ENV)
// 图片地址前缀
export const URL_PREFIX = 'https://gm-itrade-1255882558.cos.ap-guangzhou.myqcloud.com/images/weapp'
// 小程序 CODE
export const APP_CODE = 'GM_ITRADE'
export const LOGIN_PROJECT_CODE = 'GM_ITRADE_C'
export const WXAPP_CODE = 'WXAPP_GMITRADE_JJLD'
// 中台API
const BASE_DOMAIN = 'public-api.jjh9999.com'
export const BASE_URL = __PROD__
  ? `https://${BASE_DOMAIN}`
  : `https://${ENV}-${BASE_DOMAIN}`

// 业务API-DOMAIN
const API_DOMAIN_BASE = 'hg-api.huangjinx.com'
const API_DOMAIN = __PROD__
  ? `${API_DOMAIN_BASE}`
  : `${ENV}-${API_DOMAIN_BASE}`
// 业务API地址
export const API_URL = `https://${API_DOMAIN}/gm-itrade`

// 文件上传
export const uploadConfig = {
  appCode: 'GM_ITRADE',
  queryUrl: `${BASE_URL}/bm-base/objectStorage/getTempCredential`,
  projectName: __PROD__ ? 'gm-itrade-h5' : 'gm-itrade-h5_test' // 项目名称
}

// 二维码地址
export const qrCodeUrl = __PROD__ ? 'https://hg.huangjinx.com' : 'http://192.168.0.91:8080'

// 二维码生成地址
export const liteUrl = __PROD__ ? 'https://lite.jjh9999.com' : 'https://test-lite.jjh9999.com'

// 行情数据源socket地址
export const SOCKET_URL_PRICE = 'wss://stws.jjh9999.com/'
export const SOCKET_TOKEN = 'junit:test'
// 业务socket地址
export const SOCKET_URL_BUSINESS = `wss://${API_DOMAIN}/websocket`
