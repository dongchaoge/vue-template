import { APP_CODE } from '@/utils/config'
import request from './request'
// 获取上传图片签名
export function getTempCredential () {
  return request(`bm-base/objectStorage/getTempCredential?appCode=${APP_CODE}`, {}, { isBase: true, noLoading: true })
}

// 通过code获取openid
export function getWxAppOpenIdAndUinfoByCode (data) {
  return request('nodebase/v1/wechat/getWxAppOpenIdAndUinfoByCode', data, { isBase: true, noLoading: true })
}
// POST 【小程序】加密数据解密encryptedData
export function getWxAppDecryptData (data) {
  return request('nodebase/v1/wechat/getWxAppDecryptData', data, { isBase: true, noLoading: true })
}

// POST 检查敏感词
export function checkSensitiveWords (data) {
  return request('nodebase/v1/wechat/checkSensitiveWords', data, { isBase: true })
}
